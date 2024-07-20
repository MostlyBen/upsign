import { useState, useEffect } from "react"
import { Navigate, useLoaderData, useParams } from "react-router-dom"
import { query, collection, onSnapshot } from "@firebase/firestore"

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import SessionCard from "./SessionCard"
import HourSelector from "./HourSelector"
import UnsignedStudents from "./UnsignedStudents"

import { 
  getHourEnrollments,
  getHourSessions,
  getAllStudents,
  getSessionTitles,
} from "../../services"

import {
  getSchoolId,
  mergeSessionEnrollment,
} from "../../utils"

import {
  DatePicker,
  LoadingBar,
  SettingsButton,
} from "../"


const AllSessionOverview = ({ db }) => {
  const params = useParams()
  const hour = params.session

  const { defaultDay, groupOptions } = useLoaderData()

  const [ sessions, setSessions ]                 = useState([])
  const [ enrollments, setEnrollments ]           = useState([])
  const [ sessionsWithEnr, setSessionsWithEnr ]   = useState([])
  const [ groupFilter, setGroupFilter ]           = useState('All Students')
  const [ selectedDate, setSelectedDate ]         = useState(defaultDay)
  const [ totalCapacity, setTotalCapacity ]       = useState(0)
  const [ loading, setLoading ]                   = useState(true)
  const [ allStudents, setAllStudents ]           = useState()
  const [ sessionTitles, setSessionTitles ]       = useState()
  const [ sessionTitle, setSessionTitle ]         = useState(`Session ${hour}`)

  const schoolId = getSchoolId()

  const loadSessions = async (db) => {
    const s = await getHourSessions(db, selectedDate, Number(hour))

    if (s.length > 0) {
      // Not sure why this check was here...
      if (Number(s[0].session) === Number(hour)) {
        s.sort( (a, b) => (a.title > b.title) ? 1 : -1 )
        setSessions( [...s] )
      }
    }
  }

  const loadSessionTitles = async (_db, _selectedDate) => {
    const newTitles = await getSessionTitles(_db, _selectedDate)

    if (Array.isArray(newTitles)) {
      setSessionTitles([...newTitles])
      return
    }

    setSessionTitles(null)
  }

  const loadEnrollments = async (_db, _selectedDate) => {
    const e = await getHourEnrollments(_db, _selectedDate, hour)
    setEnrollments( [...e] )
  }

  const handleSelectDate = (date) => {
    setSelectedDate(date)
  }

  // All Students List
  useEffect(() => {
    getAllStudents(db, true).then(r => { setAllStudents(r) })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db])

  // Session Titles
  useEffect(() => {
    loadSessionTitles(db, selectedDate)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, selectedDate])

  useEffect(() => {
    if (Array.isArray(sessionTitles) && hour <= sessionTitles.length) {
      setSessionTitle(sessionTitles[hour - 1])
      return
    }

    setSessionTitle(`Session ${hour}`)
  }, [sessionTitles, hour, selectedDate])

  // SESSIONS: Load & subscribe to updates
  useEffect(() => {
    setLoading(true)
    setSessions([])
    // Set up snapshot & load sessions
    const sQuery = query(
                collection(
                  db,
                  "schools",
                  schoolId,
                  "sessions",
                  String(selectedDate.getFullYear()),
                  String(selectedDate.toDateString())
                  )
                );
    const unsubscribe = onSnapshot(sQuery, () => {
      loadSessions(db)
      setLoading(false)
    })

    return () => unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, selectedDate, hour])

  // ENROLLMENTS: Load & subscribe to updates
  useEffect(() => {
    setEnrollments([])
    // Set up snapshot & load sessions
    const eQuery = query(
                collection(
                  db,
                  "schools",
                  schoolId,
                  "sessions",
                  String(selectedDate.getFullYear()),
                  `${String(selectedDate.toDateString())}-enrollments`
                  )
                );
    const unsubscribe = onSnapshot(eQuery, () => {
      loadEnrollments(db, selectedDate)
    })

    return () => unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, selectedDate, hour])

  // Combine sessions & enrollments whenever one of them updates
  useEffect(() => {
    const newArray = mergeSessionEnrollment(sessions, enrollments)
    setSessionsWithEnr( [...newArray] )
  }, [sessions, enrollments])

  // Reset state when hour or day is changed
  useEffect(() => {
    setSessions([])
    setEnrollments([])
  }, [hour, selectedDate])

  // Calculate total capacity
  useEffect(() => {
    let cap = 0
    for (let i = 0; i < sessions.length; i++) {
      cap = cap + Number(sessions[i].capacity)
    }
    setTotalCapacity(cap)
  }, [sessions])

  if (!hour) {
    return <Navigate to="/overview/1" />
  }

  return (
    <div>
      {/* --- HEADINGS --- */}
      <div style={{ marginTop: "3rem" }}>
        <h3
          className="all-sessions-heading"
          >
            {sessionTitle}
            <span className="total-capacity">
              Total Capacity: 
              {` ${totalCapacity}`}
            </span>
        </h3>
        <HourSelector
          selected={hour}
          schoolId={schoolId}
          db={db}
          selectedDate={selectedDate}
        />
      </div>

      {/* --- BUTTONS --- */}
      <div className="row">
        {/* Group Dropdown Trigger */}
        <div className='col s12 m6'>
          <select
            className='btn group-dropdown u-shadow'
            onChange={(e) => setGroupFilter(e.target.value)}
            value={groupFilter}
          >
            {/* Options */}
            <option value="All Students">All Students</option>
            {groupOptions.map((option, i) => {
              return (
                <option
                  value={option}
                  key={`group-options-${i}-${option}`}
                >{option}</option>
              )
            })}
          </select>
        </div>

        {/* Date Picker */}
        <div className="col s12 m6">
          <DatePicker selectedDate={selectedDate} handleSelectDate={handleSelectDate} />
        </div>
        
      </div>
      
      {/* Show loading bar if loading */}
      {loading
       ? <LoadingBar />
       : <div />
      }

      {/* --- BODY --- */}
      <DndProvider backend={HTML5Backend}>
        <div className="row">
          <div className="col s12 cards-container">
            {/* Don't render UnsignedStudents if still loading */}
            {loading
            ? <div />
            : <UnsignedStudents
                key="unsigned-students"
                db={db}
                schoolId={schoolId}
                date={selectedDate}
                hour={hour}
                groupFilter={groupFilter}
              />
            }

            {sessionsWithEnr.map( s => {
              return <SessionCard
                  key={`session-${s.id}`}
                  id={`session-${s.id}`}
                  db={db}
                  date={selectedDate}
                  session={s}
                  hour={hour}
                  filter={groupFilter}
                  groupOptions={groupOptions}
                  allStudents={allStudents}
                />
            })}
          </div>
        </div>
      </DndProvider>
      <SettingsButton />
    </div>
  )
}

export default AllSessionOverview
import { useState, useEffect } from "react"
import { Redirect } from "react-router-dom"
import { query, collection, onSnapshot } from "@firebase/firestore"

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import SessionCard from "./SessionCard"
import HourSelector from "./HourSelector"
import UnsignedStudents from "./UnsignedStudents"

import { 
  getHourEnrollments,
  getHourSessions,
  getGroups,
  getNextFriday,
} from "../../services"

import {
  getSubdomain,
  mergeSessionEnrollment,
} from "../../utils"

import DatePicker from "../SignUp/DatePicker"
import LoadingBar from "../SmallBits/LoadingBar"


const AllSessionOverview = ({ db, match }) => {
  const hour = match.params.session
  const [ sessions, setSessions ]                 = useState([])
  const [ enrollments, setEnrollments ]           = useState([])
  const [ sessionsWithEnr, setSessionsWithEnr ]   = useState([])
  const [ groupOptions, setGroupOptions ]         = useState([])
  const [ groupFilter, setGroupFilter ]           = useState('All Students')
  const [ selectedDate, setSelectedDate ]         = useState(new Date())
  const [ totalCapacity, setTotalCapacity ]       = useState(0)
  const [ loading, setLoading ]                   = useState(true)

  const schoolId = getSubdomain()

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

  const loadEnrollments = async (db) => {
    const e = await getHourEnrollments(db, selectedDate, hour)
    setEnrollments( [...e] )
  }

  const updateGroupOptions = async () => {
    const options = await getGroups(db)
    setGroupOptions(options)
  }

  const handleSelectDate = (date) => {
    setSelectedDate(date)
  }

  // Select default day
  useEffect(() => {
    const nextFriday = getNextFriday()
    setSelectedDate(nextFriday)
    // Get list of student groups for filter
    updateGroupOptions()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
  }, [db, selectedDate, hour, groupFilter])

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
      loadEnrollments(db)
    })

    return () => unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, selectedDate, hour, groupFilter])

  // Combine sessions & enrollments whenever one of them updates
  useEffect(() => {
    const newArray = mergeSessionEnrollment(sessions, enrollments)
    // Doesn't re-render the cards if you just setSessionsWithEnr(newArray)
    // So I changed loadSessions & loadEnrollments, too
    setSessionsWithEnr( [...newArray] )
  }, [sessions, enrollments])

  // Reset state when hour is changed
  useEffect(() => {
    setSessions([])
    setEnrollments([])
  }, [hour])

  useEffect(() => {
    let cap = 0
    for (let i = 0; i < sessions.length; i++) {
      cap = cap + Number(sessions[i].capacity)
    }
    setTotalCapacity(cap)
  }, [sessions])

  if (!hour) {
    return <Redirect to="/overview/1" />
  }

  return (
    <div>
      {/* --- HEADINGS --- */}
      <div style={{ marginTop: "3rem" }}>
        <h3
          className="all-sessions-heading"
          >
            Session
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
          <div
            className='dropdown-trigger btn group-dropdown white cyan-text text-darken-2'
            data-target={`filter-dropdown`}
          >
            {groupFilter}
            <span
              className="material-icons"
              style={{position: "relative", top: "0.45rem", margin: "0 0 -0.5rem 0.25rem"}}
            >
              expand_more
            </span>
          </div>
        </div>

        {/* Date Picker */}
        <div className="col s12 m6">
          <DatePicker selectedDate={selectedDate} handleSelectDate={handleSelectDate} />
        </div>
        
      </div>

      {/* Group Dropdown Structure */}
      <ul id={`filter-dropdown`} className='dropdown-content'>
      <li><a
          href="#!"
          onClick={() => setGroupFilter('All Students')}
        >
          All Students
        </a></li>
        
        <li className="divider" key="divider-1" tabIndex="-1" />

        {groupOptions.map(option => {
              return (
                <li key={`dropdown-item-${option}`}><a
                  href="#!"
                  onClick={() => setGroupFilter(option)}
                  key={`dropdown-link-${option}`}
                >
                  {option}
                </a></li>)
            })}
      </ul>
      
      {loading
       ? <LoadingBar />
       : <div />
      }
      {/* --- BODY --- */}
      <DndProvider backend={HTML5Backend}>
        <div className="row">
          <div className="col s12 cards-container">
            <UnsignedStudents
              key="unsigned-students"
              db={db}
              schoolId={schoolId}
              date={selectedDate}
              hour={hour}
              groupFilter={groupFilter}
            />
            {sessionsWithEnr.map( s => {
              return <SessionCard
                  key={`session-${s.id}`}
                  id={`session-${s.id}`}
                  db={db}
                  date={selectedDate}
                  session={s}
                  hour={hour}
                  filter={groupFilter}
                />
            })}
          </div>
        </div>
      </DndProvider>

    </div>
  )
}

export default AllSessionOverview
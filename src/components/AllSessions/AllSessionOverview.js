import { useState, useEffect } from "react"
import { Redirect } from "react-router-dom"
import { query, collection, onSnapshot } from "@firebase/firestore"

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import SessionCard from "./SessionCard"
import HourSelector from "./HourSelector"
import UnsignedStudents from "./UnsignedStudents"

import { 
  getHourSessions,
  getUnsignedStudents,
  getGroups,
  getSubdomain,
  getNextFriday,
} from "../../utils"

import DatePicker from "../SignUp/DatePicker"


const AllSessionOverview = ({ db, match }) => {
  const hour = match.params.session
  const [sessions, setSessions] = useState([])
  const [unsignedStudents, setUnsignedStudents] = useState([])
  const [groupOptions, setGroupOptions] = useState([])
  const [groupFilter, setGroupFilter] = useState('All Students')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [totalCapacity, setTotalCapacity] = useState(0)

  const schoolId = getSubdomain()

  const loadSessions = async (db) => {
    const s = await getHourSessions(db, selectedDate, Number(hour))
    const u = groupFilter === 'All Students'
      ? await getUnsignedStudents(db, selectedDate, Number(hour))
      : await getUnsignedStudents(db, selectedDate, Number(hour), groupFilter)

    if (s.length > 0) {
      if (Number(s[0].session) === Number(hour)) {
        s.sort( (a, b) => (a.title > b.title) ? 1 : -1 )
        setSessions(s)
        setUnsignedStudents(u)
      }
    }
  }

  const updateGroupOptions = async () => {
    const options = await getGroups(db)
    setGroupOptions(options)
  }

  const handleSelectDate = (date) => {
    setSelectedDate(date)
  }

  // Select upcoming Friday
  useEffect(() => {
    const nextFriday = getNextFriday()

    setSelectedDate(nextFriday)
  }, [])

  useEffect(() => {
    setSessions([])
    // Get list of student groups for filter
    updateGroupOptions()

    // Set up snapshot & load sessions
    const q = query(collection(db, "schools", schoolId, "sessions", String(selectedDate.getFullYear()), String(selectedDate.toDateString()))/*, where("session", "==", Number(hour))*/);
    const unsubscribe = onSnapshot(q, () => {
      loadSessions(db)
    })

    return () => unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, selectedDate, hour, groupFilter])

  useEffect(() => {
    setSessions([])
    setUnsignedStudents([])
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

      {/* <hr /> */}
      
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

      <DndProvider backend={HTML5Backend}>
        <div className="row">
          <div className="col s12 cards-container">
            {sessions.length > 0
              ? <UnsignedStudents key="unsigned-students" students={unsignedStudents} />
              : <div></div>}
            {sessions.map( s => {
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
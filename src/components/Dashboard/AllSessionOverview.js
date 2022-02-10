import { useState, useEffect } from "react"
import { Link, Redirect } from "react-router-dom"
import { query, collection, where, onSnapshot } from "@firebase/firestore"

import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import M from 'materialize-css';

import { getHourSessions, enrollStudent, getUnsignedStudents, getAllStudents, getGroups } from "../../utils"
import SessionEditor from "../SignUp/SessionEditor"
// import DatePicker from "../SignUp/DatePicker"

const SessionSelector = ({selected}) => {
  const hours = ['1', '2', '3', '4', '5']
  const activeSelection = selected ?? '1'

  return (
    <div style={{ width: "100%" }}>
      <ul className="pagination" style={{ marginTop: "0", marginBottom: "0" }}>

        {hours.map(hour => {
          return (
            <li
              className={ hour === activeSelection ? "active teal lighten-2" : "waves-effect" }
              key={`${hour}-selector`}
              style={{ width: "100%", height: "3rem", padding: "0.445rem 0" }}
            >
              <Link to={`/overview/${hour}`} style={{fontSize: "2rem", width: "100%"}}>{ hour }</Link>
            </li>
          )
        })}

      </ul>
    </div>
  )
}

const StudentName = ({ enrollment, currentSession }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'student',
    item: {
      enrollment: enrollment,
      currentSession: currentSession,
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    })
  }))

  return (
    <div
    ref={drag}
    key={`enrollment-${enrollment.uid}`}
    style={{ opacity: isDragging ? 0.25 : 1, cursor: 'move', marginBottom: '0.5rem' }}
  >
    {enrollment.name} {enrollment.attendance
    ? <span style={{color: "dimgrey", margin: "0 0 0 0.5rem"}}>|<span style={{margin: "0 0 0 0.75rem", fontWeight: "500",
        color: enrollment.attendance === "present" ? "#009688" : enrollment.attendance === "tardy" ? "#f9a825" : "#d32f2f"}}>
        {enrollment.attendance.charAt(0).toUpperCase() + enrollment.attendance.slice(1)}</span>
      </span>
    : null}
  </div>
  )
}

const UnsignedStudents = ({ students }) => {

  return (
    <div className="">
      <div className={`card session-card is-enrolled`}>
          {/* Title & Info */}
          <h1>Unsigned Students</h1>
          <hr style={{ margin: '1rem 0' }} />

          {/* Student List */}
          <div className="student-list">
            {Array.isArray(students)
            ? students.map(e => {
              return (
                <StudentName key={`student-list-${e.name}`} enrollment={e} currentSession={{}} />
              )
            })
            : <div />}
          </div>
      </div>
    </div>
  )
}

const SessionCard = ({ db, session, filter, setOpenSession }) => {
  const [filteredEnrollment, setFilteredEnrollment] = useState(session.enrollment)
  const [allStudentRef, setAllStudentRef] = useState()
  const [showOpen, setShowOpen] = useState(false)

  useEffect(() => {
    // This should probably happen on the page level, so it doesn't make this request for every card
    getAllStudents(db, true).then(r => { setAllStudentRef(r) })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if ( filter !== 'All Students' ) {
      const s = []

      if ( Array.isArray(session.enrollment) ) {

        for ( var i = 0; i < session.enrollment.length; i++ ) {
          try {
            if (Array.isArray(allStudentRef[session.enrollment[i].uid].groups)) {
              if ( allStudentRef[session.enrollment[i].uid].groups.includes(filter) ) {
                s.push(session.enrollment[i])
              }
            }
          } catch (err) {
            // console.log(err)
          }
        }
        
      }

      setFilteredEnrollment(s)

    } else {
      setFilteredEnrollment(session.enrollment)
    }
  }, [filter, allStudentRef, session])


  const [monitor, drop] = useDrop(() => ({
    accept: 'student',
    drop: () => {
      const user = monitor.getItem().enrollment

      enrollStudent(db, session, user, true)
    },
    collect: monitor => (monitor),
  }))

  if ( Array.isArray(session.enrollment) ) {
    session.enrollment.sort( (a, b) => (a.name > b.name) ? 1 : -1 )
  }

  return (
    <div
      className=""
      onMouseEnter={() => { setShowOpen(true) }}
      onMouseLeave={() => { setShowOpen(false) }}
      style={{
        display: `${filter !== 'All Students' && Array.isArray(filteredEnrollment)
        ? filteredEnrollment.length > 0
          ? ''
          // FIX ME WHEN MULTIPLE FILTERS CAN BE SET
          : session.restricted_to === filter ? '' : 'none'
        : ''}`,
      }}
    >
      <div className={`card session-card`} ref={drop}>
        <div className={`open-session-div
          ${ showOpen
          ? ''
          : 'hidden'
          }`}
        >
            <span
              data-target="modal1"
              className="modal-trigger material-icons open-session"
              onClick={() => setOpenSession(session)}
            >
              open_in_full
            </span>
          </div>

          {/* Title & Info */}
          <h1 style={{paddingRight: '2rem'}}>{session.title}</h1>
          <hr style={{ margin: '1rem 0' }} />
          <h2>{session.teacher}</h2>
          <h2>{session.room ?? 'No Room'}</h2>

          <hr style={{margin: '1rem 0'}} />

          {/* Student List */}
          <div className="student-list">
            <h2 style={{ margin: '1rem 0', fontWeight: '500' }}>Students</h2>
            <h2 className="capacity-overview">
              {Array.isArray(session.enrollment) ? session.enrollment.length : 0}/{session.capacity}
            </h2>
            <div>
              {Array.isArray(session.enrollment)
              ? filteredEnrollment.map(e => {
                return (
                  <StudentName key={`student-list-${e.name}`} enrollment={e} currentSession={session} />
                )
              })
              : <div />}
            </div>
          </div>
      </div>
    </div>
  )
}


const AllSessionOverview = ({ db, match }) => {
  const hour = match.params.session
  const [sessions, setSessions] = useState([])
  const [unsignedStudents, setUnsignedStudents] = useState([])
  const [groupOptions, setGroupOptions] = useState([])
  const [groupFilter, setGroupFilter] = useState('All Students')
  const [openSession, setOpenSession] = useState({})
  // const [selectedDate, setSelectedDate] = useState(new Date())

  const loadSessions = async (db) => {
    const s = await getHourSessions(db, Number(hour))
    const u = groupFilter === 'All Students'
      ? await getUnsignedStudents(db, Number(hour))
      : await getUnsignedStudents(db, Number(hour), groupFilter)

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

  useEffect(() => {
    // Get list of student groups for filter
    updateGroupOptions()

    // Set up snapshot & load sessions
    const q = query(collection(db, "sessions"), where("session", "==", Number(hour)));
    const unsubscribe = onSnapshot(q, () => {
      loadSessions(db)
    })

    return () => unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, hour, groupFilter])

  useEffect(() => {
    setSessions([])
    setUnsignedStudents([])
  }, [hour])

  useEffect(() => {
    M.AutoInit()
  }, [groupOptions])

  if (!hour) {
    return <Redirect to="/overview/1" />
  }

  return (
    <div>
      {/* Session Pop-Up */}
      <div id="modal1" className="modal teacher-sessions session-card teacher-card">
        <div className="modal-content row">
          { Object.keys(openSession) !== 0
            ? <SessionEditor key={openSession.id} session={openSession} db={db} />
            : <div /> }
        </div>
      </div>

      <div style={{ marginTop: "3rem" }}>
        <h3 style={{ margin: "0 0 1rem 0", letterSpacing: "1px" }}>Session </h3>
        <SessionSelector
          selected={hour}
        />
      </div>

      <hr />
      
      <div className="row">
        {/* Date Picker */}
        {/* <div className="col s12 m6">
          <DatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        </div> */}
        
        {/* Group Dropdown Trigger */}
        <div className='col s12'>
          <div
            className='dropdown-trigger btn group-dropdown white cyan-text text-darken-2'
            data-target={`filter-dropdown`}
            style={{paddingTop: '0.25rem', margin: '0.5rem 0 1.5rem 0'}}
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
            <UnsignedStudents key="unsigned-students" students={unsignedStudents} />
            {sessions.map( s => {
              return <SessionCard
                  key={`session-${s.id}`}
                  id={`session-${s.id}`}
                  db={db}
                  session={s}
                  hour={hour}
                  filter={groupFilter}
                  setOpenSession={setOpenSession}
                />
            })}
          </div>
        </div>
      </DndProvider>

    </div>
  )
}

export default AllSessionOverview
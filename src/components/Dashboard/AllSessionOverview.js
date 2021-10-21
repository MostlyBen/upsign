import { useState, useEffect } from "react"
import { Link, Redirect } from "react-router-dom"
import { query, collection, where, onSnapshot } from "@firebase/firestore"

import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { getHourSessions, enrollStudent, getUnsignedStudents } from "../../utils"

const SessionSelector = ({selected}) => {
  const hours = ['1', '2', '3', '4', '5', '6', '7']
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

const UnsignedStudents = (props) => {

  return (
    <div className="col s12 m6 l4">
      <div className={`card session-card is-enrolled`}>
          {/* Title & Info */}
          <h1>Unsigned Students</h1>
          <hr style={{ margin: '1rem 0' }} />

          {/* Student List */}
          <div className="student-list">
            {Array.isArray(props.students)
            ? props.students.map(e => {
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

const SessionCard = ({ db, session }) => {
  const [monitor, drop] = useDrop(() => ({
    accept: 'student',
    drop: () => {
      const user = monitor.getItem().enrollment

      enrollStudent(db, session, user, true)
    },
    collect: monitor => (monitor),
  }))

  if (Array.isArray(session.enrollment)) {
    session.enrollment.sort( (a, b) => (a.name > b.name) ? 1 : -1 )
  }

  return (
    <div className="col s12 m6 l4">
      <div className={`card session-card`} ref={drop}>
          {/* Title & Info */}
          <h1>{session.title}</h1>
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
              ? session.enrollment.map(e => {
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


const AllSessionOverview = (props) => {
  const hour = props.match.params.session
  const [sessions, setSessions] = useState([])
  const [unsignedStudents, setUnsignedStudents] = useState([])

  const loadSessions = async (db) => {
    const s = await getHourSessions(db, Number(hour))
    const u = await getUnsignedStudents(db, Number(hour))
    if (s.length > 0) {
      if (Number(s[0].session) === Number(hour)) {
        s.sort( (a, b) => (a.title > b.title) ? 1 : -1 )
        setSessions(s)
        setUnsignedStudents(u)
      }
    }
  }

  useEffect(() => {
    // Set up snapshot & load sessions
    console.log("Adding listener for hour", hour)
    const q = query(collection(props.db, "sessions"), where("session", "==", Number(hour)));
    const unsubscribe = onSnapshot(q, () => {
      loadSessions(props.db)
    })

    return () => unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.db, hour])

  useEffect(() => {
    setSessions([])
    setUnsignedStudents([])
  }, [hour])


  if (!hour) {
    return <Redirect to="/overview/1" />
  }

  return (
    <div>
      <div style={{ marginTop: "3rem" }}>
        <h3 style={{ margin: "0 0 1rem 0", letterSpacing: "1px" }}>Session </h3>
        <SessionSelector
          selected={hour}
        />
      </div>

      <hr style={{ margin: "1.445rem 0" }} />

      <DndProvider backend={HTML5Backend}>
        <div className="row">
          <UnsignedStudents key="unsigned-students" students={unsignedStudents} />
          {sessions.map(s => {
            return <SessionCard key={`session-${s.id}`} db={props.db} session={s} hour={hour} />
          })}
        </div>
      </DndProvider>

    </div>
  )
}

export default AllSessionOverview
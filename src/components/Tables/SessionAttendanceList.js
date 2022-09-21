import { useState, useEffect } from "react"
import { query, collection, onSnapshot } from "@firebase/firestore"
import {
  getSessionEnrollments,
  unenrollFromSession,
  updateEnrollment,
  updateSession,
} from "../../services"
import { LittleLoadingBar } from "../"

const EnrollmentRow = ({ db, session, enrollment, date }) => {
  const [showRemove, setShowRemove] = useState(0)

  // Un-dims the row when the update comes through
  useEffect(() => {
    const elem = document.getElementById(`enrollment-row-${session.id}-${enrollment.uid}`)
    if (elem) {
      elem.classList.remove('dim')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enrollment.attendance])

  const handleMouseEnter = () => {
    setShowRemove(1)
  }

  const handleMouseLeave = () => {
    setShowRemove(0)
  }

  const handleRemoveStudent = (uid, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from this workshop?`)) {
      unenrollFromSession(db, date, uid, session.id)
    }
  }

  const handleCheck = (value) => {
    value = ( value === enrollment.attendance ? '' : value )
    // Dim the row (to be lightened on update from firestore)
    const elem = document.getElementById(`enrollment-row-${session.id}-${enrollment.uid}`)
    if (elem) {
      elem.classList.add('dim')
    }

    updateEnrollment(db, date, enrollment.id, {
      attendance: value,
    })
    
  }

  return (
    <tr
      className="student-name"
      id={`enrollment-row-${session.id}-${enrollment.uid}`}
      key={`${enrollment.uid}-${session.id}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <td
        style={{padding: "0 0 0 1.5rem", textAlign: "left"}}
      >
        {enrollment.nickname ?? enrollment.name}
        <span
          className="material-icons icon-button-offset"
          onClick={() => handleRemoveStudent(enrollment.uid, enrollment.name)}
          style={{ opacity: showRemove, userSelect: 'none' }}
        >close</span>
      </td>

        {/* Present */}
        <td
          style={{padding: "0"}}
        >
          <label style={{lineHeight: "0", textAlign: "center"}}>
            <input
              type="checkbox"
              className="filled-in"
              id={`present-check-${enrollment.uid}`}
              checked={enrollment.attendance === "present" ? "checked" : ""}
              onChange={() => handleCheck("present")}
            />
            <span style={{ marginTop: "10px", paddingLeft: "1.445rem" }} />
          </label>
        </td>

        {/* Tardy */}
        <td
          style={{padding: "0"}}
        >
          <label style={{lineHeight: "0"}}>
            <input
              type="checkbox"
              className="filled-in"
              id={`tardy-check-${enrollment.uid}`}
              checked={enrollment.attendance === "tardy" ? "checked" : ""}
              onChange={() => handleCheck("tardy")}
            />
            <span style={{ marginTop: "10px", paddingLeft: "1.445rem" }} />
          </label>
        </td>

        {/* Absent */}
        <td
          style={{padding: "0"}}
        >
          <label style={{lineHeight: "0"}}>
            <input
              type="checkbox"
              className="filled-in"
              id={`absent-check-${enrollment.uid}`}
              checked={enrollment.attendance === "absent" ? "checked" : ""}
              onChange={() => handleCheck("absent")}
            />
            <span style={{ marginTop: "10px", paddingLeft: "1.445rem" }} />
          </label>
        </td>
      
    </tr>
  )
}

const SessionAttendanceList = ({ db, schoolId, date, session }) => {
  const [ enrollments, setEnrollments ] = useState([])
  const [ loading, setLoading ] = useState(true)

  const loadEnrollments = async (db) => {
    const sessionEnrollments = await getSessionEnrollments(db, date, session.id)
    setEnrollments(sessionEnrollments)
    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    setEnrollments([])
    // Set up snapshot & load sessions
    const eQuery = query(
                collection(
                  db,
                  "schools",
                  schoolId,
                  "sessions",
                  String(date.getFullYear()),
                  `${String(date.toDateString())}-enrollments`
                  )
                );
    const unsubscribe = onSnapshot(eQuery, () => {
      loadEnrollments(db)
    })

    return () => unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db])

  // Update session.number_enrolled if it's wrong
  useEffect(() => {
    if (Array.isArray(session.enrollment)) {
      if ( Number(session.enrollment.length) !== session.number_enrolled ) {
        updateSession(db, date, session.id, {
          number_enrolled: Number(session.enrollment.length),
        }, schoolId)
      }
    }
  }, [db, date, session.enrollment, session.number_enrolled, session.id, schoolId])
  
  if (Array.isArray(enrollments)) {
    enrollments.sort( (a, b) => ((a.nickname ?? a.name) > (b.nickname ?? b.name)) ? 1 : -1 )
  }

  if (loading) {
    return (
      <div>
        <table className="student-list striped centered">
          <thead>
            <tr>
              <th style={{textAlign: "left", padding: "0 0 0 1.5rem"}}>Name</th>
              <th>Present</th>
              <th>Tardy</th>
              <th>Absent</th>
            </tr>
          </thead>
        </table>
        <LittleLoadingBar style={{width: "100%"}} />
      </div>
    )
  }

  return (
    <table className="student-list highlight centered">
      <thead>
        <tr>
          <th style={{textAlign: "left", padding: "0 0 0 1.5rem"}}>Name</th>
          <th>Present</th>
          <th>Tardy</th>
          <th>Absent</th>
        </tr>
      </thead>

      <tbody>
        { Array.isArray(enrollments)
          ? enrollments.length === 0
            ? <tr>
                <td className="student-name student-name-empty">No Students</td>
                <td />
                <td />
                <td />
              </tr>
            : enrollments.map(e => (
              <EnrollmentRow db={db} date={date} session={session} enrollment={e} key={`row-${e.uid}`} />
            ))
          : <tr>
              <td className="student-name student-name-empty">No Students</td>
              <td />
              <td />
              <td />
            </tr> }
        </tbody>
    </table>
  )
}

export default SessionAttendanceList
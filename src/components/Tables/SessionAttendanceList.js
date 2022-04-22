import { useState } from "react"

import { doc, setDoc } from "@firebase/firestore"

const EnrollmentRow = ({ db, session, enrollment }) => {
  const [attendance, setAttendance] = useState(enrollment.attendance ?? '')
  const [showRemove, setShowRemove] = useState(0)

  const handleMouseEnter = () => {
    setShowRemove(1)
  }

  const handleMouseLeave = () => {
    setShowRemove(0)
  }

  const handleRemoveStudent = (uid, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from this workshop?`)) {
      const payload = session

      let e = session.enrollment.filter(obj => {
        return obj.uid !== uid
      })

      payload['enrollment'] = e

      setDoc(doc(db, "sessions", session.id), {...payload})
    }
  }

  const handleCheck = (value) => {
    value = ( value === attendance ? '' : value )

    setAttendance(value)

    enrollment['attendance'] = value

    let payload = session
    // Should construct a session object instead
    payload['restricted_to'] = payload.restricted_to ?? ''

    for (var i in payload.enrollment.length) {
      if (payload.enrollment[i].uid === enrollment.uid) {
        payload.enrollment[i] = enrollment
        break
      }
    }

    setDoc(doc(db, "sessions", session.id), {...payload})
  }

  return (
    <tr
      className="student-name"
      key={`${enrollment.name}-${session.id}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <td
        style={{padding: "0 0 0 1.5rem", textAlign: "left"}}
      >
        {enrollment.name}
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
            checked={attendance === "present" ? "checked" : ""}
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
            checked={attendance === "tardy" ? "checked" : ""}
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
            checked={attendance === "absent" ? "checked" : ""}
            onChange={() => handleCheck("absent")}
          />
          <span style={{ marginTop: "10px", paddingLeft: "1.445rem" }} />
        </label>
      </td>
      
    </tr>
  )
}

const SessionAttendanceList = ({ db, session }) => {
  if (Array.isArray(session.enrollment)) {
    session.enrollment.sort( (a, b) => (a.name > b.name) ? 1 : -1 )
  }

  return (
    <table className="student-list striped centered">
      <thead>
        <tr>
          <th style={{textAlign: "left", padding: "0 0 0 1.5rem"}}>Name</th>
          <th>Present</th>
          <th>Tardy</th>
          <th>Absent</th>
        </tr>
      </thead>

      <tbody>
        { Array.isArray(session.enrollment)
          ? session.enrollment.length === 0
            ? <tr>
                <td className="student-name student-name-empty">No Students</td>
                <td />
                <td />
                <td />
              </tr>
            : session.enrollment.map(e => (
              <EnrollmentRow db={db} session={session} enrollment={e} key={`row-${e.uid}`} />
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
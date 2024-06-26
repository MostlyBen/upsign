import { useState, useEffect } from "react"
import { Emoji } from 'emoji-picker-react'
import { query, collection, onSnapshot } from "@firebase/firestore"
import {
  getDefaultReactions,
  getSessionEnrollments,
  unenrollFromSession,
  updateEnrollment,
  // updateSession,
} from "../../services"
import { EmojiSelect, LittleLoadingBar } from "../"

const EnrollmentRow = ({ db, session, enrollment, date }) => {
  const [showRemove, setShowRemove] = useState(0)
  const [reactionOpen, setReactionOpen] = useState(false)
  const [reactions, setReactions] = useState()

  // Update the reactions list
  useEffect(() => {
    const updateReactions = async () => {
      const _reactions = await getDefaultReactions(db)
      setReactions(_reactions)
    }
    updateReactions()
  }, [db])

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
    setReactionOpen(false)
  }

  const handleClickEmoji = (emoji) => {
    handleMouseLeave()
    updateEnrollment(db, date, enrollment.id, {
      flag: emoji
    })
  }

  const handleRemoveFlag = () => {
    updateEnrollment(db, date, enrollment.id, {
      flag: null
    })
  }

  const handleRemoveStudent = (uid, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from this session?`)) {
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
      onMouseOver={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <td
        className="enrollment-name-cell"
        style={{padding: "0 0 0 1.5rem", textAlign: "left"}}
      >
        {enrollment.nickname ?? enrollment.name}
        <EmojiSelect open={reactionOpen} onSubmit={handleClickEmoji} reactions={reactions} />

        {enrollment.flag
        ? <button className="remove-btn-styling" onClick={() => handleRemoveFlag()} style={{transform: "translateY(2px)"}}>
            <Emoji unified={enrollment.flag ?? "1f389"} size="16" />
          </button>
        : <span
            className="material-icons-outlined icon-button-offset"
            onClick={() => setReactionOpen(o => !o)}
            style={{
              opacity: showRemove,
              userSelect: 'none',
            }}
          >add_reaction</span>
        }

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
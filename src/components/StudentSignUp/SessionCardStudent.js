import { useState, useEffect } from "react"
import { Emoji } from 'emoji-picker-react'

import {
  enrollStudent,
  unenrollFromSession,
} from "../../services"

const SessionCardStudent = ({ db, selectedDate, session, userDoc, signupAllowed, userEnrollments, locked }) => {
  const [ isFull, setIsFull ] = useState(false)
  const [ isEnrolled, setIsEnrolled ] = useState(false)
  const [ enrollmentFlag, setEnrollmentFlag ] = useState()
  const [ isEnabled, setIsEnabled ] = useState(true)

  const handleClick = (enrolled) => {
    if (signupAllowed && !locked) {
      if (!isFull || isEnrolled) {

        setIsEnabled(false)

        if (enrolled) {
          unenrollFromSession(db, selectedDate, userDoc.uid, session.id)
        } else if ( (session.number_enrolled ?? 0) < Number(session.capacity)) {
          enrollStudent(db, selectedDate, session, userDoc)
        }
      }
    }
  }

  useEffect(() => {
    setIsEnabled(true)
  }, [isEnrolled])

  // When the number_enrolled or capacity updates
  useEffect(() => {
    // Check if the session is full
    if (typeof session.number_enrolled === "number") {
      if (session.number_enrolled >= Number(session.capacity)) {
        setIsFull(true)
      } else {
        setIsFull(false)
      }
    } else {
      setIsFull(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.number_enrolled, session.capacity])

  useEffect(() => {
    setIsEnrolled(false)
    setEnrollmentFlag(null)

    for (var e of userEnrollments) {
      if ( String(e.session_id) === String(session.id) ) {
        setIsEnrolled(true)
        setEnrollmentFlag(e.flag)
      }
    }
  }, [userEnrollments, session.id])

  // Check if filtering changes if the userDoc is updated
  useEffect(() => {
    getIsFiltered()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDoc])

  const getIsFiltered = () => {
    // Make sure the session is shown if the student is enrolled
    if (isEnrolled) {
      return false
    }

    if (Number(session.capacity) === 0 && !isEnrolled) {
      return true
    }

    let groupBlocking = true

    // If the session is restricted to an array of groups
    if (Array.isArray(session.restricted_to)) {
      for (var i = 0; i <= session.restricted_to.length+1; i++) {
        if (Array.isArray(userDoc.groups)) {
          if (userDoc.groups.includes(session.restricted_to[i])) {
            groupBlocking = false
          }
        }
      }
    } else {
      // If the session is restricted to something & it's not an empty string
      if (session.restricted_to !== undefined && session.restricted_to !== "") {
        if (Array.isArray(userDoc.groups)) {
          if (userDoc.groups.includes(session.restricted_to)) {
            groupBlocking = false
          }
        }
      // If the session is restricted to undefined or "", don't block it
      } else {
        groupBlocking = false
      }
      
    }

    return groupBlocking
  }


  if (!signupAllowed && !isEnrolled) {
    return <div />
  }

  if (locked && !isEnrolled) {
    return <div />
  }

  if (getIsFiltered()) {
    return <div />
  }

  return (
    <div>
      <div className={`card session-card selectable-card ${isEnrolled ? 'is-enrolled' : ''} ${isFull ? 'is-full' : ''} ${isEnabled ? '' : 'not-enabled'}`} onClick={() => handleClick(isEnrolled)}>
        <div className={`session-card-content ${isEnrolled ? 'is-enrolled' : ''} ${isFull ? 'is-full' : ''}`}>
          {/* Title */}
          <h1>
            {/* Flag */}
            {enrollmentFlag && <span style={{marginRight: '6px', transform: 'translateY(3px)', display: 'inline-block'}}>
              <Emoji unified={enrollmentFlag ?? "1f389"} size="24" />
            </span>}
            {/* Title */}
            {session.title} {(locked && signupAllowed) ? <span className={`material-icons student-lock`} style={{transform: 'translateY(4px)'}}>lock</span> : ''}
          </h1>
          {(session.subtitle && session.subtitle !== "undefined") && <h2 style={{opacity: 0.8}}>{session.subtitle}</h2>}
          <hr style={{ margin: '1rem 0' }} />
          <h2>{session.teacher ?? 'No Teacher'}</h2>
          <h2 className="student-card-room">{session.room ?? 'No Room'}</h2>
          <h2 className="capacity">
            {session.number_enrolled ?? 0}/{session.capacity}
          </h2>
        </div>
      </div>
    </div>
  )
}

export default SessionCardStudent
import { useState, useEffect } from "react"

import {
  enrollStudent,
  unenrollFromSession,
} from "../../services"

const SessionCardStudent = ({ db, selectedDate, session, userDoc, signupAllowed, enrollment }) => {
  const [ isFull, setIsFull ] = useState(false)
  const [ isEnrolled, setIsEnrolled ] = useState(false)
  const [ isEnabled, setIsEnabled ] = useState(true)

  const handleClick = (enrolled) => {
    if (signupAllowed) {
      setIsEnabled(false)

      if (enrolled) {
        unenrollFromSession(db, selectedDate, userDoc.uid, session.id)
      } else if (Number(enrollment.length) < Number(session.capacity)) {
        enrollStudent(db, selectedDate, session, userDoc)
      }
    }
  }

  useEffect(() => {
    setIsEnabled(true)
  }, [isEnrolled])

  // When the enrollment or capacity updates
  useEffect(() => {
    setIsEnrolled(false)
    // Check if the session is full
    if (Array.isArray(enrollment)) {
      if (Number(enrollment.length) >= Number(session.capacity)) {
        setIsFull(true)
      } else {
        setIsFull(false)
      }
    }
  
    // Check if the student is enrolled
    if (Array.isArray(enrollment)) {
      for (var i = 0; i < enrollment.length; i++) {
        if (String(enrollment[i].uid) === String(userDoc.uid)) {
          setIsEnrolled(true)
          break
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enrollment, session.capacity])

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

  if (getIsFiltered()) {
    return <div />
  }

  return (
    <div>
      <div className={`card session-card selectable-card ${isEnrolled ? 'is-enrolled' : ''} ${isFull ? 'is-full' : ''} ${isEnabled ? '' : 'not-enabled'}`} onClick={() => handleClick(isEnrolled)}>
        <div className={`session-card-content ${isEnrolled ? 'is-enrolled' : ''} ${isFull ? 'is-full' : ''}`}>
          {/* Title */}
          <h1>{session.title}</h1>
          <hr style={{ margin: '1rem 0' }} />
          <h2>{session.teacher ?? 'No Teacher'}</h2>
          <h2>{session.room ?? 'No Room'}</h2>
          <h2 className="capacity">
            {Array.isArray(enrollment) ? enrollment.length : 0}/{session.capacity}
          </h2>
        </div>
      </div>
    </div>
  )
}

export default SessionCardStudent
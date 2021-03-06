import { useState, useEffect } from "react"
import { doc, getDoc, onSnapshot } from "firebase/firestore";

import { enrollStudent, getSignupAllowed } from "../../utils"

const SessionCard = ({ db, date, session, user }) => {
  // The session card decides whether or not display should be done depending on
  // whether or not student signups are active
  // This should probably happen sooner so less data is loaded, but this was a quick fix

  const [ isFull, setIsFull ] = useState(false)
  const [ isEnrolled, setIsEnrolled ] = useState(false)
  const [ signupAllowed, setSignupAllowed] = useState(false)
  const [ userDoc, setUserDoc ] = useState({})

  const updateSignupAllowed = async () => {
    const allowed = await getSignupAllowed(db)
    setSignupAllowed(allowed)
  }
  

  const getUserDoc = async () => {
    const userRef = doc(db, "users", user.uid)
    getDoc(userRef)
      .then(userSnap => {
        if (userSnap.exists()) {
          setUserDoc(userSnap.data())
        }
      })
  }

  useEffect(() => {
    updateSignupAllowed()
    getUserDoc()

    const signupAllowedRef = doc(db, "config", "student_signup")
    const unsubscribe = onSnapshot(signupAllowedRef, (doc) => {
      const active = doc.data().active
      if (typeof active === "boolean") {
        setSignupAllowed(active)
      }
    })

    return () => unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleClick = (enrolled) => {
    if (Number(session.enrollment.length) < Number(session.capacity) && signupAllowed) {
      enrollStudent(db, date, session, user)
    } else if (signupAllowed && enrolled) {
      enrollStudent(db, date, session, user)
    }
  }

  useEffect(() => {
    setIsEnrolled(false)
    if (Array.isArray(session.enrollment)) {
      if (Number(session.enrollment.length) >= Number(session.capacity)) {
        setIsFull(true)
      } else {
        setIsFull(false)
      }
    }
  
    if (Array.isArray(session.enrollment)) {
      for (var i = 0; i < session.enrollment.length; i++) {
        if (String(session.enrollment[i].uid) === String(user.uid)) {
          setIsEnrolled(true)
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  const getIsFiltered = () => {
    // Make sure the session is shown if the student is enrolled
    if (isEnrolled) {
      return false
    }

    let groupBlocking = true

    if (Array.isArray(session.restricted_to)) {
      for (var i = 0; i <= session.restricted_to.length+1; i++) {
        if (Array.isArray(userDoc.groups)) {
          if (userDoc.groups.includes(session.restricted_to[i])) {
            groupBlocking = false
          }
        }
      }
    } else {

      if (session.restricted_to !== undefined && session.restricted_to !== "") {
        if (Array.isArray(userDoc.groups)) {
          if (userDoc.groups.includes(session.restricted_to)) {
            groupBlocking = false
          }
        }
      } else {
        groupBlocking = false
      }
      
    }

    return groupBlocking
  }


  if (session.capacity === '0') {
    return <div />
  }

  if (!signupAllowed && !isEnrolled) {
    return <div />
  }

  if (getIsFiltered()) {
    return <div />
  }

  return (
    <div>
      <div className={`card session-card selectable-card ${isEnrolled ? 'is-enrolled' : ''} ${isFull ? 'is-full' : ''}`} onClick={() => handleClick(isEnrolled)}>
        <div className={`session-card-content ${isEnrolled ? 'is-enrolled' : ''} ${isFull ? 'is-full' : ''}`}>
          {/* Title */}
          <h1>{session.title}</h1>
          <hr style={{ margin: '1rem 0' }} />
          <h2>{session.teacher ?? 'No Teacher'}</h2>
          <h2>{session.room ?? 'No Room'}</h2>
          <h2 className="capacity">
            {Array.isArray(session.enrollment) ? session.enrollment.length : 0}/{session.capacity}
          </h2>
        </div>
      </div>
    </div>
  )
}

const SessionSelector = ({ db, date, user, hourSessions, hour }) => {
  // This is horrible. Do anything else.
  const sessionTimes = {
    1: '8:30 - 9:35',
    2: '9:45 - 10:50',
    3: '11:00 - 12:05 // 11:20 - 12:25',
    4: '12:35 - 1:40',
    5: '1:50 - 2:55',
  }
  
  return (
    <div className="session-selector row">
      {/* This is horrible. Do better. */}
      <h4>Session {hour}
        <span style={{color: 'gray'}}> {sessionTimes[hour] ? '('+sessionTimes[hour]+')': ''}</span>
      </h4>
      <hr />
      <div className="cards-container">
        { hourSessions.map (session => <SessionCard key={`session-card-${session.id}`} session={session} user={user} db={db} date={date} /> ) }
      </div>
    </div>
  )
}

export default SessionSelector
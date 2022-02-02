import { useState, useEffect } from "react"
import { doc, getDoc, onSnapshot } from "firebase/firestore";

import { enrollStudent, getSignupAllowed } from "../../utils"

const SessionCard = ({ db, session, user }) => {
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
      enrollStudent(db, session, user)
    } else if (signupAllowed && enrolled) {
      enrollStudent(db, session, user)
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
    // let passportBlocking = true
    let groupBlocking = true
    // console.log(session)

    // if (session.passport_required) {
    //   if (Array.isArray(userDoc.groups)) {
    //     if (userDoc.groups.includes("Has Passport")) {
    //       passportBlocking = false
    //     }
    //   }
    // } else {
    //   passportBlocking = false
    // }

    if (session.restricted_to !== undefined && session.restricted_to !== "") {
      if (Array.isArray(userDoc.groups)) {
        if (userDoc.groups.includes(session.restricted_to)) {
          groupBlocking = false
        }
      }
    } else {
      groupBlocking = false
    }

    // if (!passportBlocking && !groupBlocking) {
    //   return false
    // }
    // return true

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
    <div className="col s12 m6 l4">
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

const SessionSelector = ({ db, user, hourSessions, hour }) => {
  
  return (
    <div className="session-selector row">
      <h4>Session {hour}</h4>
      <hr />
      { hourSessions.map (session => <SessionCard key={`session-card-${session.id}`} session={session} user={user} db={db} /> ) }
    </div>
  )
}

export default SessionSelector
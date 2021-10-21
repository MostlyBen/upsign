import { useState, useEffect } from "react"
import { doc, getDoc, onSnapshot } from "firebase/firestore";

import { enrollStudent } from "../../utils"

const SessionCard = (props) => {
  // The session card decides whether or not display should be done depending on
  // whether or not student signups are active
  // This should probably happen sooner so less data is loaded, but this was a quick fix
  const session = props.session

  const [ isFull, setIsFull ] = useState(false)
  const [ isEnrolled, setIsEnrolled ] = useState(false)
  const [ signupAllowed, setSignupAllowed] = useState(false)
  const [ userDoc, setUserDoc ] = useState({})

  const signupAllowedRef = doc(props.db, "config", "student_signup")
  const getSignupAllowed = async () => {
    getDoc(signupAllowedRef).then(signupAllowedSetting => {
      if (signupAllowedSetting.exists()) {
        const active = signupAllowedSetting.data().active
        if (typeof active === "boolean") {
          setSignupAllowed(active)
        }
      }
    })
  }
  

  const getUserDoc = async () => {
    const userRef = doc(props.db, "users", props.user.uid)
    getDoc(userRef)
      .then(userSnap => {
        if (userSnap.exists()) {
          setUserDoc(userSnap.data())
        }
      })
  }

  useEffect(() => {
    getSignupAllowed()
    getUserDoc()

    const unsubscribe = onSnapshot(signupAllowedRef, (doc) => {
      const active = doc.data().active
      if (typeof active === "boolean") {
        setSignupAllowed(active)
      }
    })

    return () => unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleClick = () => {
    if (!isFull) {
      enrollStudent(props.db, session, props.user)
    }
  }

  useEffect(() => {
    setIsEnrolled(false)
    if (Array.isArray(session.enrollment)) {
      if (Number(session.enrollment.length) === Number(session.capacity)) {
        setIsFull(true)
      } else {
        setIsFull(false)
      }
    }
  
    if (Array.isArray(session.enrollment)) {
      for (var i = 0; i < session.enrollment.length; i++) {
        if (String(session.enrollment[i].uid) === String(props.user.uid)) {
          setIsEnrolled(true)
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  const getIsFiltered = () => {
    console.log("user groups", userDoc.groups)
    if (session.restricted_to !== undefined) {
      // Returns true if the session should be filtered out
      if (Array.isArray(userDoc.groups)) {
        if (userDoc.groups.includes(session.restricted_to)) {
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    } else {
      return false
    }
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
      <div className={`card session-card selectable-card ${isEnrolled ? 'is-enrolled' : ''}`} onClick={handleClick}>
        <div className={`session-card-content ${isFull ? 'is-full' : ''} ${isEnrolled ? 'is-enrolled' : ''}`}>
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

const SessionSelector = (props) => {
  const hourSessions = props.hourSessions
  const hour = props.hour
  
  return (
    <div className="session-selector row">
      <h4>Session {hour}</h4>
      <hr />
      { hourSessions.map (session => <SessionCard key={`session-card-${session.id}`} session={session} user={props.user} db={props.db} /> ) }
    </div>
  )
}

export default SessionSelector
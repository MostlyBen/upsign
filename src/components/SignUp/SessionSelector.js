import { useState, useEffect } from "react"

import enrollStudent from "../../utils/sessions/enrollStudent"

const SessionCard = (props) => {
  const session = props.session

  const [ isFull, setIsFull ] = useState(false)
  const [ isEnrolled, setIsEnrolled ] = useState(false)

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


  if (session.capacity === '0') {
    return <div />
  }

  return (
    <div className="col s12 m6 l4">
      <div className={`card session-card ${isEnrolled ? 'is-enrolled' : ''}`} onClick={handleClick}>
        <div className={`session-card-content ${isFull ? 'is-full' : ''} ${isEnrolled ? 'is-enrolled' : ''}`}>
          {/* Title */}
          <h1>{session.title}</h1>
          <hr />
          <h2>{session.teacher}</h2>
          <h2>{session.room}</h2>
          <div className="capacity">
            {Array.isArray(session.enrollment) ? session.enrollment.length : 0}/{session.capacity}
          </div>
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
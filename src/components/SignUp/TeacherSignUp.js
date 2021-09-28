import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "@firebase/firestore"

import { getTeacherSessions } from "../../utils";
import SessionEditor from "./SessionEditor";

const TopMessage = ({ user }) => {
  
  return (
    <div>
      <h3 style={{marginTop: "3rem", userSelect: "none"}}>
        <div>Hey there{user ? <b>, {user.displayName.split(' ')[0]}</b> : ''}</div>
      </h3>
      <blockquote className="top-message">
        <p>Please fill in every session you want to hold this Friday.</p>
        <p>Include any Prep hours as a session with no Room and 0 Capacity.</p>
      </blockquote>
      <hr style={{margin: "1rem 0 3rem 0"}} />
    </div>
  )
}

const TeacherSignUp = (props) => {
  const db = props.db;
  const user = props.user;

  const [sessions, setSessions] = useState()

  const handleLoadSessions = async () => {
    await getTeacherSessions(db, user)
      .then(s => {
        setSessions(s)
      })
  }

  useEffect(() => {
    handleLoadSessions()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const q = query(collection(db, "sessions"), where("teacher", "==", user.displayName));
    onSnapshot(q, async () => {
      await getTeacherSessions(db, user)
        .then( s => {
          setSessions(s)
        }
      )
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db])

  if (!sessions) {
    return (
      <div>
        <TopMessage user={user} />
        
        <div className="progress">
          <div className="indeterminate" />
        </div>
      </div>
    )
  }

  return (
    <div>
      <TopMessage user={user} />

      <div className="teacher-sessions">
        { Array.isArray(sessions) ? sessions.map(s => <SessionEditor key={s.id} session={s} db={props.db} />) : null }
      </div>
    </div>
  )
}

export default TeacherSignUp
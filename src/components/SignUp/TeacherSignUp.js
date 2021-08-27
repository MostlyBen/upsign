import { useState, useEffect } from "react";

import { getTeacherSessions } from "../../utils";
import SessionEditor from "./SessionEditor";

const TeacherSignUp = (props) => {
  const db = props.db;
  const user = props.user;

  const [sessions, setSessions] = useState([])

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

  console.log("sessions:", sessions)
  return (
    <div>
      { Array.isArray(sessions) ? sessions.map(s => <SessionEditor key={s.id} session={s} db={props.db} />) : null }
    </div>
  )
}

export default TeacherSignUp
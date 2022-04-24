import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "@firebase/firestore"
import M from "materialize-css";

import { getTeacherSessions } from "../../utils";
import SessionEditor from "./SessionEditor";
import { LoadingBar } from "../";
// import DatePicker from "./DatePicker";

const TopMessage = ({ user }) => {
  
  return (
    <div>
      <h3 style={{marginTop: "3rem", userSelect: "none"}}>
        <div>Hey there, {user
            ? user.nickname
              ? <b>{user.nickname.split(' ')[0]}</b>
              : <b>{user.displayName.split(' ')[0]}</b>
            : ''}
        </div>
      </h3>
      <blockquote className="top-message">
        <p>Please fill in every session you want to hold this Friday.</p>
        <p>For prep hours, just leave the title of the session blank.</p>
      </blockquote>
      <hr style={{margin: "1rem 0 1rem 0"}} />
    </div>
  )
}

const TeacherSignUp = (props) => {
  const db = props.db;
  const user = props.user;

  const [sessions, setSessions] = useState()
  // const [selectedDate, setSelectedDate] = useState(new Date())

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
    M.AutoInit()

  }, [sessions])

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

  const sessionTimes = {
    1: '8:30 - 9:34',
    2: '9:37 - 10:41',
    3: '10:44 - 11:48 or 11:09 - 12:13',
    4: '12:16 - 1:20',
    5: '1:23 - 2:27',
  }

  if (!sessions) {
    return (
      <div>
        <TopMessage user={user} />
        
        <LoadingBar />
      </div>
    )
  }

  return (
    <div>
      <TopMessage user={user} />
      {/* <DatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} /> */}

      <div className="teacher-sessions">
        { Array.isArray(sessions) ? sessions.map(s =>
          <div key={s.id}>
            {/* This is horrible. Do better. */}
            <h4>Session {s.session} 
              <span style={{color: 'gray'}}> {sessionTimes[s.session] ? '('+sessionTimes[s.session]+')': ''}</span>
            </h4>
            <hr style={{marginBottom: "1rem"}} />
            <div className="row card session-card is-enrolled teacher-card">
              <SessionEditor key={s.id} session={s} db={props.db} />
            </div>
          </div>
        ) : null }
      </div>
    </div>
  )
}

export default TeacherSignUp
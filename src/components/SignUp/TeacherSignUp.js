import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "@firebase/firestore"

import { getTeacherSessions, getSubdomain } from "../../utils";
import SessionEditor from "./SessionEditor";
import { LoadingBar } from "../";
import DatePicker from "./DatePicker";

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
  const [selectedDate, setSelectedDate] = useState(new Date())

  const schoolId = getSubdomain()

  const handleLoadSessions = async () => {
    await getTeacherSessions(db, selectedDate, user)
      .then(s => {
        setSessions(s)
      })
  }

  const handleSelectDate = (date) => {
    setSelectedDate(date)
  }

  useEffect(() => {
    // Select upcoming Friday
    const dateCopy = new Date(new Date().getTime())
    const nextFriday = new Date(
      dateCopy.setDate(
        dateCopy.getDate() + ((7 - dateCopy.getDay() + 5) % 7 || 7)
      )
    )

    setSelectedDate(nextFriday)

    // Load teacher sessions
    handleLoadSessions()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  useEffect(() => {
    const q = query(collection(db, "schools", schoolId, "sessions", String(selectedDate.getFullYear()), String(selectedDate.toDateString())), where("teacher", "==", user.displayName));
    onSnapshot(q, async () => {
      await getTeacherSessions(db, selectedDate, user)
        .then( s => {
          setSessions(s)
        }
      )
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, selectedDate])

  const sessionTimes = {
    1: '8:30 - 9:35',
    2: '9:45 - 10:50',
    3: '11:00 - 12:05 // 11:20 - 12:25',
    4: '12:35 - 1:40',
    5: '1:50 - 2:55',
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
      <DatePicker selectedDate={selectedDate} handleSelectDate={handleSelectDate} />

      <div className="teacher-sessions">
        { Array.isArray(sessions) ? sessions.map(s =>
          <div key={s.id}>
            {/* This is horrible. Do better. */}
            <h4>Session {s.session} 
              <span style={{color: 'gray'}}> {sessionTimes[s.session] ? '('+sessionTimes[s.session]+')': ''}</span>
            </h4>
            <hr style={{marginBottom: "1rem"}} />
            <div className="row card session-card is-enrolled teacher-card">
              <SessionEditor key={s.id} session={s} db={props.db} date={selectedDate} />
            </div>
          </div>
        ) : null }
      </div>
    </div>
  )
}

export default TeacherSignUp
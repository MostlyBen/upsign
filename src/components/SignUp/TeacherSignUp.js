import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, doc } from "@firebase/firestore"

import { getSessionTimes, getNumberSessions } from "../../services";
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
  // This is just needed to getTeacherSessions again if the number updates
  // getTeacherSessions also creates sessions for the teacher
  const [numberSessions, setNumberSessions] = useState(1)
  const [selectedDate, setSelectedDate] = useState(new Date())

  const [sessionTimes, setSessionTimes] = useState([])

  const updateSessionTimes = async (db) => {
    const newTimes = await getSessionTimes(db)
    setSessionTimes(newTimes)
  }

  const updateNumberSessions = async (db) => {
    const newNumber = await getNumberSessions(db)
    setNumberSessions(newNumber)
  }

  // Subscribe to updates for session number and times
  useEffect(() => {
    // Set up snapshot & load the times of the sessions
    const d = doc(db, "schools", schoolId, "config", "sessions")
    const unsubscribe = onSnapshot(d, () => {
      updateSessionTimes(db)
      updateNumberSessions(db)
    })

    return () => unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db])

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
  }, [db, selectedDate, numberSessions])



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
              <span style={{color: 'gray'}}> {sessionTimes[s.session - 1] ? '('+sessionTimes[s.session - 1]+')': ''}</span>
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
import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, doc } from "@firebase/firestore"

import { SessionHolder } from "../../components";

import {
  getSessionTimes,
  getNumberSessions,
  getTeacherSessions,
  getDefaultDay,
} from "../../services";
import {
  observeTopIntersect,
  getSchoolId,
} from "../../utils";

import { DatePicker, LoadingBar, SettingsButton } from "../";

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
        <p>Please fill in whatever sessions you want to hold.</p>
        <p>You can select any day of the year now!</p>
        <p>Sessions without titles will not show up as options for students.</p>
      </blockquote>
      <hr style={{margin: "1rem 0 1rem 0"}} />
    </div>
  )
}

// Clunky, but it gets the job done
const renderHours = (db, selectedDate, numberSessions, sessionTimes, sessions, user) => {
  var hourArr = []
  for (let i = 1; i < numberSessions + 1; i++) {
    hourArr.push(i)
  }

  return (<>
    {hourArr.map(hour => {
      return <SessionHolder db={db} selectedDate={selectedDate} hour={hour} sessionTimes={sessionTimes} sessions={sessions[String(hour)]} user={user} />
    })}
  </>)
}

const TeacherSignUp = ({ db, user }) => {

  const [sessions, setSessions] = useState()
  // This is just needed to getTeacherSessions again if the number updates
  // getTeacherSessions also creates sessions for the teacher
  const [numberSessions, setNumberSessions] = useState(1)
  const [selectedDate, setSelectedDate] = useState()
  const [sessionTimes, setSessionTimes] = useState([])

  const schoolId = getSchoolId()

  const updateSessionTimes = async (db) => {
    const newTimes = await getSessionTimes(db, selectedDate)
    setSessionTimes(newTimes)
  }

  const updateNumberSessions = async (db) => {
    const newNumber = await getNumberSessions(db, selectedDate)
    setNumberSessions(newNumber)
  }

  // Initialize the observer
  // Checks when the DatePicker (".sticky-container") intersects with the navbar
  useEffect(() => {
    observeTopIntersect()
  }, [sessions])

  // Subscribe to updates for session number and times
  useEffect(() => {
    if (selectedDate) {
      // Set up snapshot & load the times of the sessions
      const d = doc(db, "schools", schoolId, "config", "sessions")
      const unsubscribe = onSnapshot(d, () => {
        updateSessionTimes(db)
        updateNumberSessions(db)
      })
      
      return () => unsubscribe()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, selectedDate])


  const handleLoadSessions = async () => {
    setSessions(null)
    await getTeacherSessions(db, selectedDate, user)
      .then(s => {
        setSessions(s)
      })
  }

  const handleSelectDate = (date) => {
    setSessions(null)
    setSelectedDate(date)
  }

  // Select default day
  const updateDefaultDay = async (db) => {
    const defaultDay = await getDefaultDay(db)
    setSelectedDate(defaultDay)
  }

  useEffect(() => {
    if (!selectedDate) {
      updateDefaultDay(db)
    } else {
      // Load teacher sessions
      handleLoadSessions()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, selectedDate])

  useEffect(() => {
    if (selectedDate) {
      const q = query(collection(
        db,
        "schools",
        schoolId,
        "sessions",
        String(selectedDate.getFullYear()),
        String(selectedDate.toDateString())),
        where("teacher", "==", user.displayName));
    const unsubscribe = onSnapshot(q, async () => {
      await getTeacherSessions(db, selectedDate, user)
      .then( s => {
        setSessions(s)
      }
      )
    })
    
    return () => unsubscribe()
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, selectedDate, numberSessions])

  useEffect(() => {
    if (Array.isArray(sessions)) {
      if (numberSessions !== sessions.length) {
        let s = sessions.slice(0, numberSessions)
        setSessions(s)
      }
    }
  }, [numberSessions, sessions])



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
      <div className="sticky-container">
        <div className="sticky-content">
          <DatePicker selectedDate={selectedDate} handleSelectDate={handleSelectDate} />
        </div>
      </div>

      <div className="teacher-sessions">
          {renderHours(db, selectedDate, numberSessions, sessionTimes, sessions, user)}
        <SettingsButton />
      </div>
    </div>
  )
}

export default TeacherSignUp
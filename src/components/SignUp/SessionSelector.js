import { useEffect, useState } from "react"
import {
  query,
  collection,
  where,
  onSnapshot,
 } from "@firebase/firestore"

import SessionCardStudent from "./SessionCardStudent"
import { LittleLoadingBar } from "../"

const SessionSelector = ({ db, selectedDate, userDoc, hour, sessionTime, signupAllowed, schoolId }) => {
  const [ hourSessions, setHourSessions ] = useState([])
  const [ hourEnrollmentObj, setHourEnrollmentObj ] = useState({})
  const [ loading, setLoading ] = useState(true)

  // Get & subscribe to sessions for the hour
  useEffect(() => {
    setLoading(true)
    const sessionQuery = query(
                collection(
                  db,
                  "schools",
                  schoolId,
                  "sessions",
                  String(selectedDate.getFullYear()),
                  String(selectedDate.toDateString())),
                where("session", "==", hour));
    
    const unsubscribe = onSnapshot(sessionQuery, querySnapshot => {
      let allSessions = [];

      querySnapshot.forEach((d) => {
        if (d.data().title) {
          allSessions.push({
            id: d.id,
            ...d.data()
          })
        }
      })

      allSessions.sort( (a, b) => (a.title > b.title) ? 1 : -1 )
      setHourSessions([...allSessions])
      setLoading(false)
    })

    return () => unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate])

  // Get & subscribe to enrollments for the hour
  useEffect(() => {
    const sessionQuery = query(
                collection(
                  db,
                  "schools",
                  schoolId,
                  "sessions",
                  String(selectedDate.getFullYear()),
                  `${String(selectedDate.toDateString())}-enrollments` ),
                where("session", "==", hour));
    
    const unsubscribe = onSnapshot(sessionQuery, querySnapshot => {
      let enrollmentsObject = {}

      querySnapshot.forEach((snap) => {
        // Save the data from the snapshot
        var d = snap.data()
        // Add the enrollment to the object
        if (Array.isArray(enrollmentsObject[d.session_id])) {
          enrollmentsObject[d.session_id].push(d)
        } else {
          enrollmentsObject[d.session_id] = [d]
        }
      })

      setHourEnrollmentObj(enrollmentsObject)
    })

    return () => unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate])

  useEffect(() => {
    let hourSessionsCopy = hourSessions;

    for (const i in hourSessionsCopy) {
      const sessionId = hourSessionsCopy[i].id
      const newEnrollment = hourEnrollmentObj[sessionId]

      if (Array.isArray(newEnrollment)) {
        hourSessionsCopy[i].enrollment = newEnrollment
      }
    }
    if (hourSessions !== hourSessionsCopy) {
      setHourSessions(hourSessionsCopy)
    }

  }, [hourSessions, hourEnrollmentObj])

  if (loading) {
    return (
      <div className="session-selector row">
      <h4>Session {hour}
        <span style={{color: 'gray'}}> {sessionTime ? '('+sessionTime+')': ''}</span>
      </h4>
      <hr />
      <LittleLoadingBar />
    </div>
    )
  }
  
  return (
    <div className="session-selector row">
      <h4>Session {hour}
        <span style={{color: 'gray'}}> {sessionTime ? '('+sessionTime+')': ''}</span>
      </h4>
      <hr />
      <div className="cards-container">
        { hourSessions.map (session => <SessionCardStudent
                                        key={`session-card-${session.id}`}
                                        session={session}
                                        userDoc={userDoc}
                                        db={db}
                                        selectedDate={selectedDate}
                                        signupAllowed={signupAllowed}
                                        enrollment={hourEnrollmentObj[session.id] ?? []}
                                        /> ) }
      </div>
    </div>
  )
}

export default SessionSelector
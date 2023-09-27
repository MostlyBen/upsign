import { useEffect, useState } from "react"
import {
  query,
  collection,
  where,
  onSnapshot,
 } from "@firebase/firestore"

import SessionCardStudent from "./SessionCardStudent"
import { LittleLoadingBar } from "../"

const SessionSelector = ({ db, selectedDate, userDoc, hour, sessionTime, signupAllowed, schoolId, userEnrollments }) => {
  const [ hourSessions, setHourSessions ] = useState([])
  const [ loading, setLoading ] = useState(true)
  const [ locked, setLocked ] = useState(false)

  // Get & subscribe to sessions for the hour
  useEffect(() => {
    // setLoading(true)
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
      let _locked = false

      querySnapshot.forEach((d) => {
        if (d.data().title) {
          for (var e of userEnrollments) {
            if ( String(e.session_id) === String(d.id) && e.locked ) {
              setLocked(true)
              _locked = true
              allSessions = [{id: d.id, ...d.data()}]
              break
            }
          }
          
          if (!_locked) {
            allSessions.push({
              id: d.id,
              ...d.data()
            })
          }

        }
      })

      allSessions.sort( (a, b) => (a.title > b.title) ? 1 : -1 )
      setHourSessions([...allSessions])
      setLoading(false)
    })

    return () => unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, selectedDate, userEnrollments])


  if (loading) {
    return (
      <div className="session-selector-container row">
      <h4 className="session-header">Session {hour}
        <span className="session-time"> {sessionTime ? '('+sessionTime+')': ''}</span>
      </h4>
      <hr />
      <LittleLoadingBar />
    </div>
    )
  }
  
  return (
    <div className="session-selector-container row">
      <h4>Session {hour}
        <span className="session-time"> {sessionTime ? '('+sessionTime+')': ''}</span>
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
                                          userEnrollments={userEnrollments}
                                          locked={locked}
                                        /> ) }
      </div>
    </div>
  )
}

export default SessionSelector
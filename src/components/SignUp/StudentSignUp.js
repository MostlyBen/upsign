import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, doc } from "@firebase/firestore"
import { getSubdomain, getNextFriday } from "../../utils";

import SessionSelector from './SessionSelector'
import { LoadingBar } from "../";
import DatePicker from "./DatePicker";
import { getNumberSessions } from "../../services";
// import { getHourSessions } from "../../utils";


const TopMessage = ({ user }) => {
  return (
    <div>
      <h3 style={{marginTop: '3rem'}}>
        <div>Hey there, {user
            ? user.nickname
              ? <b>{user.nickname.split(' ')[0]}</b>
              : <b>{user.displayName.split(' ')[0]}</b>
            : ''}
        </div>
      </h3>
      <blockquote className="top-message">
        <p>Please sign up for the sessions you want below.</p>
        <p>Just click on what you want. Your choices are automatically saved 😊</p>
      </blockquote>

      <hr style={{margin: "1.5rem 0 1.5rem 0"}} />
      
    </div>
  )
}


const StudentSignUp = (props) => {
  const db = props.db;
  const user = props.user;

  const [sessions, setSessions] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [numberSessions, setNumberSessions] = useState(1)

  const schoolId = getSubdomain()

  const updateNumberSessions = async (db) => {
    const newNumber = await getNumberSessions(db)
    setNumberSessions(newNumber)
  }

  useEffect(() => {
    // Set up snapshot & load the times of the sessions
    const d = doc(db, "schools", schoolId ?? "museum", "config", "sessions")
    const unsubscribe = onSnapshot(d, () => {
      updateNumberSessions(db)
    })

    return () => unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db])

  // Select upcoming Friday
  // NEEDS TO BE UPDATED SO DEFAULT DAY OF THE WEEK CAN BE SET AND TURNED ON/OFF
  useEffect(() => {
    const nextFriday = getNextFriday()

    setSelectedDate(nextFriday)
  }, [])

  // Initialize the update listeners
  useEffect(() => {
    for ( var j = 0; j < numberSessions; j++ ) {
      const index = j
      const hour = j + 1

      const q = query(
                      collection(db,
                                 "schools",
                                 schoolId,
                                 "sessions",
                                 String(selectedDate.getFullYear()),
                                 String(selectedDate.toDateString())),
                      where("session", "==", hour)
                      );

      
      onSnapshot(q, (querySnapshot) => {
        console.log("Updating sessions")
        console.log(querySnapshot.docChanges())

        let hourSessions = [];
        querySnapshot.forEach((doc) => {
          if (doc.data().title) {
            hourSessions.push({
              id: doc.id,
              ...doc.data()
            })
          }
        })
        hourSessions.sort( (a, b) => (a.title > b.title) ? 1 : -1 )
        let tempSessions = sessions
        tempSessions[index] = hourSessions
        setSessions([...tempSessions])
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, selectedDate, numberSessions])


  if (sessions.length === 0) {
    return (
      <div>
        <TopMessage user={user} />
        <LoadingBar />
      </div>
    )
  }

  if (Array.isArray(sessions)) {
    return (
      <div>
        <TopMessage user={user} />
        <DatePicker selectedDate={selectedDate} handleSelectDate={setSelectedDate} />

        { sessions.map( (session, index) => <SessionSelector key={`session-${index}`} hourSessions={session} hour={index+1} user={user} db={db} date={selectedDate} schoolId={schoolId} /> ) }
      </div>
    )
  }

  return (
    <div>
      Uh oh! An error occured while trying to load your sessions.
    </div>
  )

}

export default StudentSignUp
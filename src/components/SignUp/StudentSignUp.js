import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "@firebase/firestore"
import { getSubdomain } from "../../utils";

import SessionSelector from './SessionSelector'
import { LoadingBar } from "../";
import DatePicker from "./DatePicker";
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

  const schoolId = getSubdomain()

  // Select upcoming Friday
  useEffect(() => {
    const dateCopy = new Date(new Date().getTime())
    const nextFriday = new Date(
      dateCopy.setDate(
        dateCopy.getDate() + ((7 - dateCopy.getDay() + 5) % 7 || 7)
      )
    )

    setSelectedDate(nextFriday)
  }, [])

  // Initialize the update listeners
  useEffect(() => {
    for ( var j = 0; j < 5; j++ ) {
      const index = j
      const hour = j + 1

      const q = query(collection(db, "schools", schoolId, "sessions", String(selectedDate.getFullYear()), String(selectedDate.toDateString())), where("session", "==", hour));
      onSnapshot(q, (querySnapshot) => {
        
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
  }, [db, selectedDate])


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

        { sessions.map( (session, index) => <SessionSelector key={`session-${index}`} hourSessions={session} hour={index+1} user={user} db={db} date={selectedDate} /> ) }
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
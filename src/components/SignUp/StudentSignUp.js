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

  const updateNumberSessions = async (db, selectedDate) => {
    const newNumber = await getNumberSessions(db, selectedDate)
    setNumberSessions(newNumber)
  }

  // Update the number of sessions if the selected date changes
  useEffect(() => {
    updateNumberSessions(db, selectedDate)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate])

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
      const q = query(
                      collection(db,
                                 "schools",
                                 schoolId,
                                 "sessions",
                                 String(selectedDate.getFullYear()),
                                 String(selectedDate.toDateString())),
                      where("title", "!=", "")
                      );

      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let allSessions = [];
        querySnapshot.forEach((doc) => {
          if (doc.data().title) {
            allSessions.push({
              id: doc.id,
              ...doc.data()
            })
          }
        })
        allSessions.sort( (a, b) => (a.title > b.title) ? 1 : -1 )
        // let tempSessions = sessions
        // tempSessions[index] = hourSessions
        let sortedSessions = []
        for (let i = 0; i < numberSessions; i++) {
          sortedSessions.push([])
        }

        allSessions.forEach((s) => {
          const index = s.session - 1
          sortedSessions[index].push(s)
        })

        setSessions([...sortedSessions])
        
      })

      return () => unsubscribe()


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

        { sessions.map( (session, index) => <SessionSelector key={`session-${index}`} hourSessions={session} hour={index+1} user={user} db={db} selectedDate={selectedDate} schoolId={schoolId} /> ) }
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
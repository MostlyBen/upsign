import { useState, useEffect } from "react";
import { onSnapshot, doc, query, where, collection } from "@firebase/firestore"
import {
  getNumberSessions,
  getDefaultDay,
  getSessionTimes,
  getSignupAllowed,
  getStudentEnrollments,
  getUser,
  getSessionTitles,
} from "../../services";
import {
  observeTopIntersect,
  getSchoolId,
} from "../../utils";

import SessionSelector from './SessionSelector'
import { DatePicker } from "../";


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

  const [ sessionArray, setSessionArray ]       = useState([])
  const [ selectedDate, setSelectedDate ]       = useState(new Date())
  const [ numberSessions, setNumberSessions ]   = useState(1)
  const [ sessionTimes, setSessionTimes ]       = useState([])
  const [ sessionTitles, setSessionTitles ]       = useState();
  const [ signupAllowed, setSignupAllowed ]     = useState(false)
  const [ userDoc, setUserDoc ]                 = useState({})
  const [ userEnrollments, setUserEnrollments ] = useState([])

  const schoolId = getSchoolId()

  const updateNumberSessions = async (db, selectedDate) => {
    const newNumber = await getNumberSessions(db, selectedDate)
    setNumberSessions(newNumber)
  }

  const updateSessionTimes = async (db, selectedDate) => {
    const newTimes = await getSessionTimes(db, selectedDate)
    setSessionTimes(newTimes)
  }

  const updateSessionTitles = async (db, selectedDate) => {
    const newTitles = await getSessionTitles(db, selectedDate)
    setSessionTitles(newTitles)
  }

  const updateSignupAllowed = async () => {
    const allowed = await getSignupAllowed(db, null, selectedDate)
    setSignupAllowed(allowed)
  }

  const refreshUserDoc = async () => {
    const res = await getUser(db, user.uid)
    setUserDoc({
      uid: user.uid,
      ...res
    })
  }

  // Select default day
  const updateDefaultDay = async (db) => {
    const defaultDay = await getDefaultDay(db)
    setSelectedDate(defaultDay)
  }

  // Get the user's enrollments
  const updateUserEnrollments = async (db, date) => {
    var enr = await getStudentEnrollments(db, date, user.uid)
    setUserEnrollments(enr)
  }

  /* Initial Load */
  useEffect(() => {
    updateDefaultDay(db)

    // Initialize the observer
    // Checks when the DatePicker (".sticky-container") intersects with the navbar
    observeTopIntersect()

    // Initially loads the user & whether or not they can sign up
    updateSignupAllowed()
    refreshUserDoc()

    const signupAllowedRef = doc(db, "schools", schoolId, "config", "student_signup")
    const unsubscribe = onSnapshot(signupAllowedRef, (doc) => {
      const active = doc.data().active
      if (typeof active === "boolean") {
        setSignupAllowed(active)
      }
    })

    return () => unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Subscribe to user doc changes
  useEffect(() => {
    const userDocRef = doc(db, "schools", schoolId, "users", user.uid)
    const unsubscribe = onSnapshot(userDocRef, () => {
      refreshUserDoc()
    })

    return () => unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db])

  // Subscribe to changes in user's enrollments
  useEffect(() => {
    const enrQuery = query(
                      collection(
                                  db,
                                  "schools",
                                  schoolId,
                                  "sessions",
                                  String(selectedDate.getFullYear()),
                                  `${String(selectedDate.toDateString())}-enrollments`
                                ),
                      where("uid", "==", user.uid)
                    )

    const unsubscribe = onSnapshot(enrQuery, () => {
      updateUserEnrollments(db, selectedDate)
    })

    updateSignupAllowed()

    return () => unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, selectedDate])

  // Update the number & times of sessions if the selected date changes
  useEffect(() => {
    // Set up snapshot & load the times of the sessions
    const d = doc(db, "schools", schoolId ?? "museum", "config", "sessions")
    const unsubscribe = onSnapshot(d, () => {
      updateSessionTimes(db, selectedDate)
      updateSessionTitles(db, selectedDate)
      updateNumberSessions(db, selectedDate)
    })

    return () => unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, selectedDate])

  // Update the number of hours to render when the number of sessions changes
  useEffect(() => {
    let newArr = []
    for (let i = 0; i < numberSessions; i++) {
      newArr.push(i)
    }
    setSessionArray(newArr)

  }, [numberSessions])


  return (
    <div>
      <TopMessage user={user} />
      <div className="sticky-container">
        <DatePicker selectedDate={selectedDate} handleSelectDate={setSelectedDate} />
      </div>

      { sessionArray.map( (index) => <SessionSelector
                                        key={`session-${index}`}
                                        hour={index+1}
                                        userDoc={userDoc}
                                        db={db}
                                        selectedDate={selectedDate}
                                        sessionTime={sessionTimes[index]}
                                        sessionTitle={Array.isArray(sessionTitles) ? sessionTitles[index] : null}
                                        signupAllowed={signupAllowed}
                                        schoolId={schoolId}
                                        userEnrollments={userEnrollments}
                                      /> ) }
    </div>
  )

}

export default StudentSignUp

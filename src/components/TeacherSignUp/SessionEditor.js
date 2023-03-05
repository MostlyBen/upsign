import { useState, useEffect } from "react"
import { useLoaderData } from "react-router-dom"
import {
  doc,
  updateDoc,
  query,
  collection,
  where,
  onSnapshot,
 } from "@firebase/firestore"


import { SessionAttendanceList } from '../'

import { getSchoolId } from "../../utils"

const SessionEditor = ({ db, session, date, groupOptions=[] }) => {
  const loaderData = useLoaderData()
  let groupList = groupOptions.length ? groupOptions : loaderData.groupOptions

  const [title, setTitle] = useState(session.title ?? "")
  const [savedTitle, setSavedTitle] = useState(session.title ?? "")
  const [room, setRoom] = useState(session.room ?? "")
  const [capacity, setCapacity] = useState(session.capacity ?? 0)

  const schoolId = getSchoolId()

  useEffect(() => {
    var titleEl = document.getElementById(`session-title-${session.id}`)
    var isActive = (titleEl === document.activeElement)

    if (!isActive) {
      setTitle(savedTitle)
    }
  }, [savedTitle, session.id])

  useEffect(() => {
    if (session.restricted_to) {
      document.getElementById(`group-select-${session.id}`).value = session.restricted_to
    } else if (session.restricted_to === "") {
      // If not restricted to anything yet, show All Students
      document.getElementById(`group-select-${session.id}`).value = ""
    }
  }, [session.id, session.restricted_to])


  /* SUBSCRIBE TO UPDATES FROM FIRESTORE */
  useEffect(() => {
    // Set up snapshot & load sessions
    if (session.id) {
      const q = query(collection(db, "schools", schoolId, "sessions", String(date.getFullYear()), String(date.toDateString())), where("id", "==", session.id));
      const unsubscribe = onSnapshot(q, querySnapshot => {
        querySnapshot.forEach( d => {
          var updatedSession = d.data();

          setSavedTitle(updatedSession.title ?? '');
          setRoom(updatedSession.room ?? '');
          setCapacity(updatedSession.capacity ?? 30);
          session.restricted_to = updatedSession.restricted_to;
        })
      })

      return () => unsubscribe()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, session])


  /* BLUR HANDLERS */
  const handleBlurTitle = () => {
    if (savedTitle !== title) {
      handleChangeTitle({target:{value:savedTitle}});
    }
  }


  /* CHANGE HANDLERS */
  const handleChangeTitle = (e) => {
    setTitle(e.target.value);

    var title = String(e.target.value);
    updateDoc(doc(db, "schools", schoolId, "sessions", String(date.getFullYear()), String(date.toDateString()), session.id), {title: title});
    session.title = title;
  }

  const handleChangeRoom = (e) => {
    setRoom(e.target.value);

    var room = String(e.target.value);
    updateDoc(doc(db, "schools", schoolId, "sessions", String(date.getFullYear()), String(date.toDateString()), session.id), {room: room});
    session.room = room;
  }

  const handleChangeCapacity = (e) => {
    setCapacity(e.target.value);

    var capacity = String(e.target.value);
    updateDoc(doc(db, "schools", schoolId, "sessions", String(date.getFullYear()), String(date.toDateString()), session.id), {capacity: capacity});
    session.capacity = capacity;
  }

  const handleRestrict = async (e) => {
    const group = e.target.value;
    updateDoc(doc(db, "schools", schoolId, "sessions", String(date.getFullYear()), String(date.toDateString()), session.id), {restricted_to: group});
    session.restricted_to = group;
  }

  return (
    <div className="session-editor">
      {/* Session Info */}
      <div className="col s12 m6">
        <div className="teacher-card-h1">
          Session Info
        </div>

        <div className="col s12">
          {/* Title */}
          <input
            className="mimic-card-h1"
            id={`session-title-${session.id}`}
            type="text"
            value={title}
            onChange={handleChangeTitle}
            autoComplete="off"
            placeholder="Session Title"
            onBlur={handleBlurTitle}
          />
        </div>

        {/* Teacher */}
        <div className="col s12">
          <h2>{session.teacher}</h2>
        </div>

        {/* Room */}
        <div className="col s6">

          <label htmlFor={`session-title-${session.id}`}>Room</label>
          <input
            className="mimic-card-h2"
            id={`session-room-${session.id}`}
            type="text"
            value={room}
            onChange={handleChangeRoom}
            autoComplete="off"
            placeholder="No Room"
          />
        </div>

        {/* Capacity */}
        <div className="col s6">
          <label htmlFor={`session-title-${session.id}`}>Capacity</label>
            <input
              className="mimic-card-h2"
              id={`session-capacity-${session.id}`}
              type="number"
              value={capacity}
              onChange={handleChangeCapacity}
              autoComplete="off"
              placeholder="Capacity"
            />
          </div>

          {/* Restrict */}
          <select
            id={`group-select-${session.id}`}
            className='btn group-dropdown'
            onChange={handleRestrict}
          >
            <option value="">All Students</option>
            {groupList.map((option) => {
              return (
                <option
                  value={option}
                  key={`group-options-${option}-${Math.floor(Math.random() * 10000)}`}
                >{option}</option>
              )
            })}
          </select>
        </div>

      {/* Student Enrollment */}
      <div className="col s12 m6">
        <div className="session-student-list-card">
          <div className="teacher-card-h1">
            Student List
          </div>
          <SessionAttendanceList db={db} schoolId={schoolId} date={date} session={session} />
        </div>
      </div>
    </div>
  )
}

export default SessionEditor
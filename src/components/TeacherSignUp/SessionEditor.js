import { useState, useEffect } from "react"
import {
  doc,
  updateDoc,
  query,
  collection,
  where,
  onSnapshot,
 } from "@firebase/firestore"


import { SessionAttendanceList } from '../'

import { getGroupOptions } from "../../services"
import { getSchoolId } from "../../utils"

import M from 'materialize-css'

const SessionEditor = ({ db, session, date }) => {

  const [title, setTitle] = useState(session.title ?? "")
  const [room, setRoom] = useState(session.room ?? "")
  const [capacity, setCapacity] = useState(session.capacity ?? 0)
  const [groupOptions, setGroupOptions] = useState([])

  const schoolId = getSchoolId()


  const updateGroupOptions = async () => {
    const options = await getGroupOptions(db)
    setGroupOptions(options)
  }

  /* INITIAL LOAD */
  useEffect(() => {
    updateGroupOptions()
    // M.AutoInit()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* SUBSCRIBE TO UPDATES FROM FIRESTORE */
  useEffect(() => {
    // Set up snapshot & load sessions
    if (session.id) {
      const q = query(collection(db, "schools", schoolId, "sessions", String(date.getFullYear()), String(date.toDateString())), where("id", "==", session.id));
      const unsubscribe = onSnapshot(q, querySnapshot => {
        querySnapshot.forEach( d => {
          var updatedSession = d.data();

          setTitle(updatedSession.title ?? '');
          setRoom(updatedSession.room ?? '');
          setCapacity(updatedSession.capacity ?? 30);
          session.restricted_to = updatedSession.restricted_to;
        })
      })

      return () => unsubscribe()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, session])

  /* INITIALIZE THE GROUP-SELECT DROPDOWN */
  useEffect(() => {
    var elems = document.querySelectorAll('.dropdown-trigger');
    M.Dropdown.init(elems, {});
  }, [groupOptions])


  /* CHANGE HANDLERS */
  const handleChangeTitle = (e) => {
    setTitle(e.target.value);

    var title = String(e.target.value);
    updateDoc(doc(db, "schools", schoolId, "sessions", String(date.getFullYear()), String(date.toDateString()), session.id), {title: title});
    session.title = title;
  }

  const handleChangeRoom = (e) => {
    setRoom(e.target.value)

    var room = String(e.target.value);
    updateDoc(doc(db, "schools", schoolId, "sessions", String(date.getFullYear()), String(date.toDateString()), session.id), {room: room});
    session.room = room;
  }

  const handleChangeCapacity = (e) => {
    setCapacity(e.target.value)

    var capacity = String(e.target.value);
    updateDoc(doc(db, "schools", schoolId, "sessions", String(date.getFullYear()), String(date.toDateString()), session.id), {capacity: capacity});
    session.capacity = capacity;
  }

  const handleRestrict = async (group) => {
    updateDoc(doc(db, "schools", schoolId, "sessions", String(date.getFullYear()), String(date.toDateString()), session.id), {restricted_to: group});
    session.restricted_to = group;
  }

  return (
    <div>
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
          <div>
            {/* <!-- Dropdown Trigger --> */}
            <div
              className='dropdown-trigger btn group-dropdown white cyan-text text-darken-2'
              data-target={`option-dropdown-${session.id}`}
            >
              {session.restricted_to
                ? session.restricted_to.length > 0 ? session.restricted_to : "Select Group"
                : "Select Group"}
              <span
                className="material-icons"
                style={{position: "relative", top: "0.45rem", margin: "0 0 -0.5rem 0.25rem"}}
              >
                expand_more
              </span>
            </div>

            {/* <!-- Dropdown Structure --> */}
            <ul id={`option-dropdown-${session.id}`} className='dropdown-content'>
            <li><a
                href="#!"
                onClick={() => handleRestrict("")}
              >
                Anyone
              </a></li>

              <li className="divider" key="divider-1" tabIndex="-1" />

              {groupOptions.map(option => {
                return (
                  <li key={`dropdown-item-${option}`}><a
                    href="#!"
                    onClick={() => handleRestrict(option)}
                    key={`dropdown-link-${option}`}
                  >
                    {option}
                  </a></li>)
              })}
            </ul>

          </div>
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
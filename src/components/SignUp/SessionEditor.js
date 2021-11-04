import { useState, useEffect } from "react"
import { doc, getDoc, setDoc, updateDoc } from "@firebase/firestore"

import { SessionAttendanceList } from '../'

import M from 'materialize-css'

const SessionEditor = (props) => {
  const db = props.db
  const session = props.session

  const [title, setTitle] = useState(session.title ?? "")
  const [room, setRoom] = useState(session.room ?? "")
  const [capacity, setCapacity] = useState(session.capacity ?? 0)
  const [groupOptions, setGroupOptions] = useState([])

  const groupRef = doc(props.db, "config", "student_groups")

  const getGroups = async () => {
    getDoc(groupRef)
      .then(groupSnap => {
        if (groupSnap.exists()) {
          const groupList = groupSnap.data().groups

          if (Array.isArray(groupList)) {
            setGroupOptions(groupList)
          }
        }
      })
  }

  useEffect(() => {
    getGroups()
    // M.AutoInit()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    var elems = document.querySelectorAll('.dropdown-trigger');
    M.Dropdown.init(elems, {});
  }, [groupOptions])

  const handleChangeTitle = (e) => {
    setTitle(e.target.value)

    let payload = session
    payload['title'] = e.target.value
    setDoc(doc(db, "sessions", session.id), payload)
  }

  const handleChangeRoom = (e) => {
    setRoom(e.target.value)

    let payload = session
    payload['room'] = e.target.value
    setDoc(doc(db, "sessions", session.id), payload)
  }

  const handleChangeCapacity = (e) => {
    setCapacity(e.target.value)

    let payload = session
    payload['capacity'] = Number(e.target.value)
    setDoc(doc(db, "sessions", session.id), payload)
  }

  const handleRestrict = async (group) => {
    updateDoc(doc(db, "sessions", session.id), {restricted_to: group});
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

              <li><a
                href="#!"
                onClick={() => handleRestrict("")}
              >
                Anyone
              </a></li>
            </ul>

          </div>
        </div>

      {/* Student Enrollment */}
      <div className="col s12 m6">
        <div className="session-student-list-card">
          <div className="teacher-card-h1">
            Student List
          </div>
          { Number(capacity) !== 0
          ? <SessionAttendanceList db={db} session={session} />
          : null}

        </div>
      </div>
    </div>
  )
}

export default SessionEditor
import { useState } from "react"

import { doc, setDoc } from "@firebase/firestore"

import { SessionAttendanceList } from '../'

const SessionEditor = (props) => {
  const db = props.db
  const session = props.session

  const [title, setTitle] = useState(session.title ?? "")
  const [room, setRoom] = useState(session.room ?? "")
  const [capacity, setCapacity] = useState(session.capacity ?? 0)

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

  return (
    <div>
      <h4>Session {session.session}</h4>
      <hr style={{marginBottom: "1rem"}} />
      <div className="row card session-card is-enrolled teacher-card">

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
              placeholder="Room"
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
    </div>
  )
}

export default SessionEditor
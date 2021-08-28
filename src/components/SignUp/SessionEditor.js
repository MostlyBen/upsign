import { useState } from "react"

import { doc, setDoc } from "@firebase/firestore"

const SessionEditor = (props) => {
  const db = props.db
  const session = props.session

  const [title, setTitle] = useState(session.title ?? "")
  const [room, setRoom] = useState(session.room ?? "")
  const [capacity, setCapacity] = useState(session.capacity ?? 0)
  const [listShown, setListShown] = useState(false)

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
    payload['capacity'] = e.target.value
    setDoc(doc(db, "sessions", session.id), payload)
  }

  const handleStudentListBtn = () => {
    setListShown(!listShown)
  }

  return (
    <div className="row card">
      <div className=" valign-wrapper">
        <div className="col card-number">
          <h3>{session.session}</h3>
        </div>
        <div className="col s11">
          {/* Title */}
          <label htmlFor={`session-title-${session.id}`}>Title</label>
          <input
            id={`session-title-${session.id}`}
            type="text" className="validate"
            value={title}
            onChange={handleChangeTitle}
            autoComplete="off"
          />
        </div>
      </div>

      <div className="row">
        {/* Room */}
        <div className="col s6">
          <label htmlFor={`session-title-${session.id}`}>Room</label>
          <input
            id={`session-room-${session.id}`}
            type="text" className="validate"
            value={room}
            onChange={handleChangeRoom}
            autoComplete="off"
          />
        </div>

      {/* Capacity */}
      <div className="col s6">
        <label htmlFor={`session-title-${session.id}`}>Capacity</label>
          <input
            id={`session-capacity-${session.id}`}
            type="number" className="validate"
            value={capacity}
            onChange={handleChangeCapacity}
            autoComplete="off"
          />
        </div>
      </div>

      {/* Student Enrollment */}
      <div className="student-list-holder">
        <div className="student-list-btn" onClick={handleStudentListBtn}>
          { capacity > 0
            ? listShown
              ? '- Hide Enrolled Students'
              : '+ Show Enrolled Students'
            : null}
        </div>

        <div className="student-list" style={{display: listShown ? 'block' : 'none'}}>
          { Array.isArray(session.enrollment)
            ? session.enrollment.length === 0
              ? <div className="student-name student-name-empty">No Students</div>
              : session.enrollment.map(s => <div className="student-name" key={`${s.name}-${session.id}`}>{s.name}</div>)
            : null }
        </div>
      </div>

    </div>
  )
}

export default SessionEditor
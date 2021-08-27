import { useState } from "react"

import { doc, setDoc } from "@firebase/firestore"

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
    payload['capacity'] = e.target.value
    setDoc(doc(db, "sessions", session.id), payload)
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
    </div>
  )
}

export default SessionEditor
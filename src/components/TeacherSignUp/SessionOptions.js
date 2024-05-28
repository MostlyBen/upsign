import { useState, useEffect } from "react";
import { addTeacherSession, removeTeacherSession } from "../../services";

const SessionOptions = ({ db, date, user, session, sessionId, show, hideRemove }) => {
  const [shouldRender, setShouldRender] = useState(show);

  useEffect(() => {
    if (show) {
      setShouldRender(true)
    } else {
      setTimeout(() => {
        setShouldRender(false)
      }, 100)
    }
  }, [show])

  const handleAddSession = async () => {
    await addTeacherSession(db, date, user, session)
  };

  const handleRemoveSession = async () => {
    await removeTeacherSession(db, date, sessionId)
  }

  return (
    <div className={`session-options-menu scale-transition ${show ? 'scale-in': 'scale-out'}`}
      style={{
        display: shouldRender ? '' : 'none',
      }}
    >
      <button
        className="btn-flat session-option-btn"
        onClick={handleAddSession}
        style={{
          display: 'block',
          width: '100%',
          borderBottom: '1px solid grey',
        }}
      >
        + Add Session
      </button>
      {!hideRemove && <button className="btn-flat session-option-btn" onClick={handleRemoveSession}>
        - Remove Session
      </button>}
    </div>
  )
}

export default SessionOptions
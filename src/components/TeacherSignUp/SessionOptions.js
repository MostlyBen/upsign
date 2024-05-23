import { addTeacherSession, removeTeacherSession } from "../../services";

const SessionMenu = ({ db, date, user, session, sessionId, show, hideRemove }) => {

  const handleAddSession = async () => {
    await addTeacherSession(db, date, user, session)
  };

  const handleRemoveSession = async () => {
    await removeTeacherSession(db, date, sessionId)
  }

  if (!show) {
    return <></>
  }

  return (
    <div className={`session-options-menu scale-transition ${show ? 'scale-in': 'scale-out'}`}>
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

export default SessionMenu
import { addTeacherSession } from "../../services";

const SessionMenu = ({ db, date, user, session, show }) => {

  const handleAddSession = async () => {
    await addTeacherSession(db, date, user, session)
  };

  return (
    <div className={`session-options-menu scale-transition ${show ? 'scale-in': 'scale-out'}`}>
      <button className="btn-flat" onClick={handleAddSession}>
        + Add Session
      </button>
    </div>
  )
}

export default SessionMenu
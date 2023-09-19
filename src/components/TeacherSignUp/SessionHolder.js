import SessionEditor from "./SessionEditor";

const SessionHolder = ({ db, selectedDate, hour, sessionTimes, sessions }) => {
  return (
    <div key={`session-${hour}-holder`} className="session-section">
    <h4 className="session-header">Session {hour} 
      <span className="session-time"> {sessionTimes[hour - 1] ? '('+sessionTimes[hour - 1]+')': ''}</span>
    </h4>
    <hr style={{marginBottom: "1rem"}} />
    <div className="row card session-card is-enrolled teacher-card">
      {sessions.map(s => {
        return <SessionEditor key={s.id} session={s} db={db} date={selectedDate} />
      })}
    </div>
  </div>
  )

}

export default SessionHolder
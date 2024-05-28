import SessionEditor from "./SessionEditor";

const SessionHolder = ({ db, selectedDate, hour, sessionTimes, sessionTitles, sessions, user }) => {
  return (
    <div key={`session-${hour}-holder`} className="session-section">
    <h4 className="session-header">{Array.isArray(sessionTitles) ? sessionTitles[hour - 1] : `Session ${hour}`}
      <span className="session-time"> {sessionTimes[hour - 1] ? '('+sessionTimes[hour - 1]+')': ''}</span>
    </h4>
    <hr style={{marginBottom: "1rem"}} />
      {sessions?.map(s => {
        return (
          <div key={`teacher-card-${s.id}`} className="row card session-card is-enrolled teacher-card">
            <SessionEditor
              session={s}
              db={db}
              date={selectedDate}
              user={user}
              hideRemove={sessions.filter(t => t.session === s.session).length === 1}
            />
          </div>
        )})}
  </div>
  )

}

export default SessionHolder
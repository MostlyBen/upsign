import { Firestore } from "@firebase/firestore";
import { useState } from "react";
import { Session, UpsignUser } from "~/types";

import SessionEditor from "./SessionEditor";
import { addTeacherSession } from "~/services";

type HourSessionsParams = {
  db: Firestore,
  selectedDate: Date,
  hour: number,
  sessionTimes: string[] | null | undefined,
  sessionTitles: string[] | null | undefined,
  sessions: Session[],
  user: UpsignUser,
  groupOptions: string[]
}

const HourSessions = ({ db, selectedDate, hour, sessionTimes, sessionTitles, sessions, user, groupOptions }: HourSessionsParams) => {
  const [sessionAdding, setSessionAdding] = useState<boolean>(false);

  const handleAddSession = () => {
    setSessionAdding(true);
    addTeacherSession(db, selectedDate, user, hour).then(() => {
      setSessionAdding(false);
    });
  }

  return (
    <div key={`session-${hour}-holder`}>
      <div className="prose">
        <h2 className="mt-4 mb-2">
          {(Array.isArray(sessionTitles) && sessionTitles.length > 0)
            ? sessionTitles[hour - 1]
            : `Session ${hour}`}
          <span className="ml-2 font-light opacity-80">
            {(Array.isArray(sessionTimes) && sessionTimes[hour - 1])
              ? `(${sessionTimes[hour - 1]})`
              : ''}
          </span>
        </h2>
      </div>
      <hr />

      {sessions?.map(s => {
        return (
          <div key={`teacher-card-${s.id}`} className="row card session-card is-enrolled teacher-card">
            <SessionEditor
              session={s}
              db={db}
              date={selectedDate}
              groupOptions={groupOptions}
              hasMultipleSessions={sessions.length > 1}
            />
          </div>
        )
      })}

      <button
        className="btn btn-ghost w-full"
        onClick={handleAddSession}
        disabled={sessionAdding}
      >+ Add Session</button>
    </div>
  )

}

export default HourSessions


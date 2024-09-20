import { Firestore } from "firebase/firestore"
import { useEffect, useState } from "react"
import {
  query,
  collection,
  where,
  onSnapshot,
} from "@firebase/firestore"

import SessionCardStudent from "./SessionCardStudent"
import { Enrollment, Session, UpsignUser } from "~/types"

type SessionSelectorProps = {
  db: Firestore,
  selectedDate: Date,
  userDoc: UpsignUser,
  hour: number,
  sessionTime?: string | null,
  sessionTitle?: string | null,
  signupAllowed: boolean,
  schoolId: string,
  userEnrollments: Enrollment[],
}

const SessionSelector = ({
  db,
  selectedDate,
  userDoc,
  hour,
  sessionTime,
  sessionTitle,
  signupAllowed,
  schoolId,
  userEnrollments
}: SessionSelectorProps) => {

  const [hourSessions, setHourSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [locked, setLocked] = useState<boolean>(false);

  // Get & subscribe to sessions for the hour
  useEffect(() => {
    const sessionQuery = query(
      collection(
        db,
        "schools",
        schoolId,
        "sessions",
        String(selectedDate.getFullYear()),
        String(selectedDate.toDateString())),
      where("session", "==", hour));

    const unsubscribe = onSnapshot(sessionQuery, querySnapshot => {
      let allSessions: Session[] = [];
      let _locked = false;

      querySnapshot.forEach((d) => {
        if (d.data().title) {
          for (const e of userEnrollments) {
            if (String(e.session_id) === String(d.id) && e.locked) {
              setLocked(true);
              _locked = true;
              allSessions = [{ id: d.id, ...d.data() } as Session];
              break;
            }
          }

          if (!_locked) {
            setLocked(false);
            allSessions.push({
              id: d.id,
              ...d.data()
            } as Session);
          }

        }
      })

      allSessions.sort((a, b) => ((a.title ?? "") > (b.title ?? "") ? 1 : -1));
      setHourSessions([...allSessions]);
      setLoading(false);
    })

    return () => unsubscribe();
  }, [db, selectedDate, userEnrollments]);


  if (loading) {
    return (
      <div className="session-selector-container row">
        <h4 className="session-header">Session {hour}
          <span className="session-time"> {sessionTime ? `(${sessionTime})` : ''}</span>
        </h4>
        <hr />
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div>

      <div className="prose">
        <h2 className="mt-4 mb-2">
          {sessionTitle ?? `Session ${hour}`}
          <span className="ml-2 font-light opacity-80">
            {sessionTime ?? ''}
          </span>
        </h2>
      </div>
      <hr className="mb-4" />

      <div className="cards-container" style={{ display: "--webkit-inline-box" }}>
        {hourSessions.map(session => <SessionCardStudent
          key={`session-card-${session.id}`}
          session={session}
          userDoc={userDoc}
          db={db}
          selectedDate={selectedDate}
          signupAllowed={signupAllowed}
          userEnrollments={userEnrollments}
          locked={locked}
        />)}
      </div>
    </div>
  )
}

export default SessionSelector


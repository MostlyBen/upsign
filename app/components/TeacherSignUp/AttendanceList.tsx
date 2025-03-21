// TODO: Add a lock to this list
import { useState, useEffect } from "react";
import { Firestore, where } from "@firebase/firestore";
import { Session, Enrollment, UpsignUser } from "~/types";
import EnrollmentRow from "./EnrollmentRow";
import { useFirebaseQuery } from "~/hooks";
import { LockClosedMicro } from "~/icons";
import { updateEnrollment } from "~/services";


interface AttendanceListProps {
  db: Firestore;
  user: UpsignUser;
  schoolId: string | null;
  date: Date;
  session: Session;
  enrollmentsFromParent?: Enrollment[];
}

const AttendanceList = ({ db, user, schoolId, date, session, enrollmentsFromParent }: AttendanceListProps) => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>(enrollmentsFromParent ?? [])
  const [loading, setLoading] = useState<boolean>(true)
  const [headHover, setHeadHover] = useState<boolean>(false);
  const [_enrollments] = enrollmentsFromParent ? [null] : useFirebaseQuery<Enrollment>(
    db,
    `schools/${schoolId}/sessions/${String(date.getFullYear())}/${date.toDateString()}-enrollments`,
    where("session_id", "==", session.id)
  );

  useEffect(() => {
    // If enrollments are managed by parent, don't load here
    if (Array.isArray(enrollmentsFromParent)) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setEnrollments([]);
  }, [db]);

  useEffect(() => {
    if (!_enrollments) { return }
    setEnrollments(
      Object.keys(_enrollments).sort((a, b) => {
        return (_enrollments[a].nickname ?? _enrollments[a].name) > (_enrollments[b].nickname ?? _enrollments[b].name)
          ? 1 : -1
      }).map(k => { return { id: k, ..._enrollments[k] } })
    );
  }, [_enrollments]);

  useEffect(() => {
    if (Array.isArray(enrollmentsFromParent)) {
      setEnrollments([...enrollmentsFromParent]);
    }
  }, [enrollmentsFromParent]);

  const handleLockAll = () => {
    let locked = true;
    for (const s of enrollments) {
      if (!s.locked) {
        locked = false;
        break;
      }
    }

    for (const s of enrollments) {
      if (!s.id) { throw new Error(`Something went wrong locking student ${s.name}`) }
      updateEnrollment(db, date, s.id, { locked: !locked })
    }
  }


  if (loading) {
    return (
      <div>
        <table className="student-list striped centered">
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "0 0 0 1.5rem" }}>Name</th>
              <th className="p-1 text-center">Present</th>
              <th className="p-1 text-center">Tardy</th>
              <th className="p-1 text-center">Absent</th>
            </tr>
          </thead>
        </table>
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th
            onPointerOver={() => setHeadHover(true)}
            onPointerOut={() => setHeadHover(false)}
            style={{ textAlign: "left", padding: "0 0 0 1.5rem" }}
          >
            Name
            <button
              className="ml-1"
              onClick={handleLockAll}
              style={{
                opacity: headHover ? 1 : 0,
                pointerEvents: headHover ? 'auto' : 'none',
              }}
            >
              <LockClosedMicro />
            </button>
          </th>
          <th className="p-1 text-center">Present</th>
          <th className="p-1 text-center">Tardy</th>
          <th className="p-1 text-center">Absent</th>
        </tr>
      </thead>

      <tbody>
        {(!Array.isArray(enrollments) || enrollments.length === 0)
          ? <tr>
            <td className="select-none pl-6 opacity-80">No Students</td>
            <td />
            <td />
            <td />
          </tr>
          : enrollments.map(e => (
            <EnrollmentRow db={db} user={user} date={date} session={session} enrollment={e} key={`row-${e.uid}`} />
          ))
        }
      </tbody>
    </table>
  )
}

export default AttendanceList;


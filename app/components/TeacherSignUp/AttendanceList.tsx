import { useState, useEffect } from "react";
import { Firestore, query, collection, onSnapshot, where } from "@firebase/firestore";
import {
  getSessionEnrollments,
} from "../../services";
import { Session, Enrollment } from "~/types";
import EnrollmentRow from "./EnrollmentRow";


interface AttendanceListProps {
  db: Firestore;
  schoolId: string | null;
  date: Date;
  session: Session;
  enrollmentsFromParent?: Enrollment[];
}

const AttendanceList = ({ db, schoolId, date, session, enrollmentsFromParent }: AttendanceListProps) => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>(enrollmentsFromParent ?? [])
  const [loading, setLoading] = useState<boolean>(true)

  const loadEnrollments = async (db: Firestore) => {
    const sessionEnrollments = await getSessionEnrollments(db, date, session.id) as Enrollment[];
    if (!Array.isArray(sessionEnrollments)) { return }

    setEnrollments(sessionEnrollments.sort((a, b) => {
      return ((a.nickname ?? a.name) > (b.nickname ?? b.name) ? 1 : -1)
    }));
    setLoading(false);
  }

  useEffect(() => {
    // If enrollments are managed by parent, don't load here
    if (Array.isArray(enrollmentsFromParent)) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setEnrollments([]);
    // Set up snapshot & load sessions
    const eQuery = query(
      collection(
        db,
        `schools/${schoolId}/sessions/${String(date.getFullYear())}/${date.toDateString()}-enrollments`
      ),
      where("session_id", "==", session.id)
    );
    const unsubscribe = onSnapshot(eQuery, () => {
      loadEnrollments(db)
    })

    return () => unsubscribe()
  }, [db]);

  useEffect(() => {
    if (Array.isArray(enrollmentsFromParent)) {
      setEnrollments([...enrollmentsFromParent]);
    }
  }, [enrollmentsFromParent]);

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
          <th style={{ textAlign: "left", padding: "0 0 0 1.5rem" }}>Name</th>
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
            <EnrollmentRow db={db} date={date} session={session} enrollment={e} key={`row-${e.uid}`} />
          ))
        }
      </tbody>
    </table>
  )
}

export default AttendanceList;


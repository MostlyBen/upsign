import { useState, useEffect } from "react";
import { query, collection, onSnapshot, Firestore } from "firebase/firestore";
import { useDrop } from "react-dnd";

import { StudentName } from "~/components";
import { Attendance, Enrollment, UpsignUser } from "~/types";
import {
  getUnsignedStudents,
  unenrollFromHour,
  unenrollFromSession,
} from "~/services";
import { getSchoolId } from "~/utils";

type UnsignedStudentsProps = {
  db: Firestore,
  date: Date,
  hour: number,
  groupFilter?: string,
  allStudents: Record<string, UpsignUser>,
  attendanceFilter?: Attendance,
}

const UnsignedStudents = ({
  db,
  date,
  hour,
  allStudents,
  groupFilter,
}: UnsignedStudentsProps) => {
  const [unsigned, setUnsigned] = useState<UpsignUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const updateUnsigned = async (db: Firestore) => {
    const _unsigned = await getUnsignedStudents(db, date, hour);
    setUnsigned([..._unsigned]);
    setLoading(false);
  }

  useEffect(() => {
    updateUnsigned(db);
  }, [db]);

  useEffect(() => {
    setLoading(true);
    const eQuery = query(
      collection(
        db,
        `schools/${getSchoolId()}/sessions/${date.getFullYear()}/${date.toDateString()}-enrollments`
      )
    );
    const unsubscribe = onSnapshot(eQuery, () => {
      updateUnsigned(db);
    })

    return () => unsubscribe();
  }, [db, date, hour])


  // DnD frame
  const [, drop]: [any, any] = useDrop(() => ({
    accept: "student",
    drop: (item: { enrollment: Enrollment }) => {
      const user = item.enrollment;
      if (!user.uid || !user.session_id) { return }
      unenrollFromSession(db, date, user.uid, user.session_id);
    },
  }), [db, date]);

  return (
    <div className="card bg-base-100 shadow-lg prose w-full p-6 rounded-md mb-4" ref={drop}>
      <h3 className="leading-6">Unsigned Students</h3>
      {loading && <p className="opacity-80 text-center">Loading...</p>}
      {unsigned.map(s => <StudentName
        key={`student-${s.uid}`}
        db={db}
        enrollment={s as Enrollment}
        user={allStudents[s.uid as string]}
        groupFilter={groupFilter}
        date={date}
      />)}
    </div>
  )
}

export default UnsignedStudents;


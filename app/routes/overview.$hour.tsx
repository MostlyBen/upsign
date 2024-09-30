import { useState, useEffect } from "react";
import { useLoaderData, useOutletContext } from "@remix-run/react";
import { Firestore, query, collection, onSnapshot } from "firebase/firestore";
import { LoaderFunctionArgs } from "react-router";
import { DndContext, DragEndEvent, pointerWithin } from "@dnd-kit/core";

import {
  SessionCard,
  UnsignedStudents,
} from "~/components";
import { getHourSessions, enrollStudent, unenrollFromSession } from "~/services";
import { Attendance, Session, UpsignUser, Enrollment } from "~/types";
import { getSchoolId } from "~/utils";

export async function loader({
  params,
}: LoaderFunctionArgs) {
  return params;
}

type ExpectedContext = {
  db: Firestore,
  enrollments: Enrollment[],
  selectedDate: Date,
  groupOptions: string[],
  allStudents: Record<string, UpsignUser>,
  groupFilter?: string,
  attendanceFilter?: string[],
}

const HourOverview = () => {
  const hour = Number(useLoaderData<typeof loader>().hour);
  const {
    db,
    enrollments,
    selectedDate,
    allStudents,
    groupFilter,
    groupOptions,
    attendanceFilter,
  } = useOutletContext() as ExpectedContext;

  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    setSessions([]);

    const fetchSessions = async () => {
      const _sessions = await getHourSessions(db, selectedDate, hour) as Session[];
      setSessions(
        [..._sessions].sort((a, b) => {
          return String(a.title) > String(b.title) ? 1 : -1
        })
      );
    }

    const sQuery = query(
      collection(db,
        `schools/${getSchoolId()}/sessions/${selectedDate.getFullYear()}/${selectedDate.toDateString()}`
      )
    );
    const unsubscribe = onSnapshot(sQuery, () => {
      fetchSessions().then(() => setLoading(false)).catch(() => setLoading(false));
    })

    return () => unsubscribe();

  }, [db, selectedDate, hour]);

  const handleDragEnd = (e: DragEndEvent) => {
    const { user, enrollment } = e.active?.data?.current as { user: UpsignUser, enrollment: Enrollment };
    if (!e.over?.data?.current || !user || !e.active?.data?.current) { return }

    if (e.over.data.current.type === "unsigned") {
      if (!e.active.data.current.currentSession) { return }
      unenrollFromSession(db, selectedDate, user?.uid as string, enrollment.session_id as string);

    } else if (e.over.data.current.type === "session") {
      if (e.over.data.current.session.id === e.active.data.current.currentSession?.id) { return }
      enrollStudent(db, selectedDate, e.over.data.current.session, user, true);
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd} collisionDetection={pointerWithin}>
      {loading && <div>Loading...</div>}
      <div
        className="absolute right-0 select-none opacity-80"
        style={{ top: "-2.75rem" }}
      >
        Total Capacity: {sessions.map(s => {
          if (s.title) { return s.capacity } else { return 0 }
        }).reduce((a, b) => a + b, 0)}
      </div>

      <div className="cards-container">
        <UnsignedStudents
          db={db}
          date={selectedDate}
          hour={hour}
          groupFilter={groupFilter}
          allStudents={allStudents}
        />
        {sessions.map((s: Session) => <SessionCard
          db={db}
          enrollments={enrollments.filter(e => e.session_id === s.id)}
          date={selectedDate}
          session={s}
          groupOptions={groupOptions}
          groupFilter={groupFilter}
          attendanceFilter={attendanceFilter as Attendance[]}
          allStudents={allStudents}
          key={s.id}
        />)}
      </div>
    </DndContext>
  )
}

export default HourOverview;


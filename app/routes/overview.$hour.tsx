import { useState, useEffect } from "react";
import { useLoaderData, useOutletContext } from "@remix-run/react";
import { Firestore, query, collection, onSnapshot } from "firebase/firestore";
import { LoaderFunctionArgs } from "react-router";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import {
  SessionCard,
  UnsignedStudents,
} from "~/components";
import { getHourSessions } from "~/services";
import { Attendance, Session, UpsignUser } from "~/types";
import { getSchoolId } from "~/utils";

export async function loader({
  params,
}: LoaderFunctionArgs) {
  return params;
}

type ExpectedContext = {
  db: Firestore,
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

  }, [db, selectedDate, hour])

  return (
    <DndProvider backend={HTML5Backend}>
      {loading && <div>Loading...</div>}

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
          date={selectedDate}
          session={s}
          groupOptions={groupOptions}
          groupFilter={groupFilter}
          attendanceFilter={attendanceFilter as Attendance[]}
          allStudents={allStudents}
          key={s.id}
        />)}
      </div>
    </DndProvider>
  )
}

export default HourOverview;


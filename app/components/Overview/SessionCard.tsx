import { useEffect, useState } from "react";
import { Firestore, query, collection, where, onSnapshot } from "firebase/firestore";
import { Attendance, Enrollment, Session, UpsignUser } from "~/types";
import { getSessionEnrollments, enrollStudent, updateEnrollment } from "~/services";
import { getSchoolId } from "~/utils";
import { useDrop } from "react-dnd";

import {
  StudentName,
  SessionModal,
} from "~/components";

import {
  ArrowsOut,
  LockClosedMicro,
  Person,
  Pin,
} from "~/icons";


type SessionCardProps = {
  db: Firestore,
  date: Date,
  session: Session,
  groupOptions: string[],
  allStudents: Record<string, UpsignUser>,
  groupFilter?: string,
  attendanceFilter?: Attendance[],
}

const SessionCard = ({
  db,
  date,
  session,
  groupOptions,
  allStudents,
  groupFilter,
  attendanceFilter
}: SessionCardProps) => {
  const [showOpen, setShowOpen] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showLock, setShowLock] = useState<boolean>(false);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  const loadEnrollments = async (db: Firestore) => {
    const sessionEnrollments = await getSessionEnrollments(db, date, session.id) as Enrollment[];
    if (!Array.isArray(sessionEnrollments)) { return }

    setEnrollments(sessionEnrollments.sort((a, b) => {
      return ((a.nickname ?? a.name) > (b.nickname ?? b.name) ? 1 : -1)
    }));
  }

  useEffect(() => {
    // Set up snapshot & load sessions
    const eQuery = query(
      collection(
        db,
        `schools/${getSchoolId()}/sessions/${String(date.getFullYear())}/${date.toDateString()}-enrollments`
      ),
      where("session_id", "==", session.id)
    );
    const unsubscribe = onSnapshot(eQuery, () => {
      loadEnrollments(db)
    })

    return () => unsubscribe()
  }, [db]);

  const [monitor, drop]: [any, any] = useDrop(() => ({
    accept: "student",
    drop: () => {
      const user = monitor.getItem().enrollment;
      if (user.session_id === session.id) { return }
      enrollStudent(db, date, session, user, true);
    },
    collect: monitor => (monitor),
  }), [db, date]);

  const handleLockAll = () => {
    let locked = true;
    for (const s of enrollments) {
      if (!s.locked) {
        locked = false;
        break;
      }
    }

    for (const t of enrollments) {
      if (!t.id) { throw new Error(`Something went wrong locking student ${t.name}`) }
      updateEnrollment(db, date, t.id, { locked: !locked })
    }
  }

  return (
    <>
      {isOpen && <SessionModal
        db={db}
        session={session}
        date={date}
        groupOptions={groupOptions}
        enrollments={enrollments}
        onClose={() => setIsOpen(false)}
      />}

      <div
        className="prose"
        onPointerOver={() => { setShowOpen(true) }}
        onPointerOut={() => { setShowOpen(false) }}
        ref={drop}
      >
        <div className="card overview-card shadow-md bg-base-100 p-6 mb-4 rounded-md">

          {showOpen && <button
            className="absolute top-4 right-4 z-10 bg-base-100"
            onClick={() => setIsOpen(true)}
          ><ArrowsOut /></button>}


          <h3 className="mt-0 mb-2 leading-6">{session.title}</h3>
          {session.subtitle && <h4
            className="mt-0 mb-2 opacity-80 leading-5"
          >{session.subtitle}</h4>}

          <hr className="my-2" />

          <div className="flex flex-row items-center">
            <Person />
            <span className="ml-2">{session.teacher ?? "No Teacher"}</span>
          </div>

          <div className="flex flex-row items-center">
            <Pin />
            <span className="ml-2">{session.room ?? "No Room"}</span>
          </div>

          <hr className="my-2" />

          <div
            className="flex flex-row justify-between align-baseline"
            onPointerEnter={() => setShowLock(true)}
            onPointerLeave={() => setShowLock(false)}
          >
            <span className="flex flex-row gap-1">
              <h4
                className="my-0 opacity-80 relative"
                style={{
                  top: "2px"
                }}
              >Students</h4>
              <button
                className="cursor-pointer relative"
                onClick={handleLockAll}
                style={{
                  display: showLock ? "" : "none",
                  top: "-2px",
                }}
              >
                <LockClosedMicro />
              </button>
            </span>
            <span>{session.number_enrolled}/{session.capacity}</span>
          </div>
          <div>
            {enrollments.map(e => <StudentName
              key={e.id}
              db={db}
              enrollment={e}
              date={date}
              currentSession={session}
              user={allStudents[e.uid as string]}
              groupFilter={groupFilter}
              attendanceFilter={attendanceFilter as Attendance[]}
              isSession
            />)}
          </div>

        </div>
      </div>
    </>
  )
}

export default SessionCard;


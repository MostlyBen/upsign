import { useEffect, useState } from "react";
import { Firestore, where } from "firebase/firestore";
import { Attendance, Enrollment, Session, UpsignUser } from "~/types";
import { updateEnrollment } from "~/services";
import { getSchoolId } from "~/utils";
import { useDroppable } from "@dnd-kit/core";

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
  enrollments: Enrollment[],
  session: Session,
  groupOptions: string[],
  allStudents: Record<string, UpsignUser>,
  groupFilter?: string,
  attendanceFilter?: Attendance[],
}

const SessionCard = ({
  db,
  date,
  enrollments,
  session,
  groupOptions,
  allStudents,
  groupFilter,
  attendanceFilter
}: SessionCardProps) => {
  const [showOpen, setShowOpen] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showLock, setShowLock] = useState<boolean>(false);
  const [hasClicked, setHasClicked] = useState<boolean>(false);

  useEffect(() => {
    if (hasClicked) {
      document.addEventListener("mousedown", () => { setShowOpen(false); setHasClicked(false) });
    }
    return () => document.removeEventListener("mousedown", () => { setShowOpen(false); setHasClicked(false) });
  }, [hasClicked]);

  const { isOver, setNodeRef } = useDroppable({
    id: `droppable-${session.id}`,
    data: {
      type: "session",
      session,
    }
  });

  const handleLockAll = () => {
    let locked = true;
    for (const k of Object.keys(enrollments)) {
      const s = enrollments[k];
      if (!s.locked) {
        locked = false;
        break;
      }
    }

    for (const k of Object.keys(enrollments)) {
      const s = enrollments[k];
      if (!s.id) { throw new Error(`Something went wrong locking student ${s.name}`) }
      updateEnrollment(db, date, s.id, { locked: !locked })
    }
  }

  return (
    <>
      {isOpen && <SessionModal
        db={db}
        session={session}
        date={date}
        groupOptions={groupOptions}
        enrollments={
          Object.keys(enrollments)
            .sort((a, b) => {
              return (enrollments[a].nickname ?? enrollments[a].name) > (enrollments[b].nickname ?? enrollments[b].name)
                ? 1 : -1;
            })
            .map(k => { return { id: k, ...enrollments[k] } })
        }
        onClose={() => setIsOpen(false)}
      />}

      <div
        className="prose"
        onClick={() => {
          setShowOpen(true);
          setHasClicked(true);
        }}
        onPointerEnter={() => { setShowOpen(true) }}
        onPointerLeave={() => {
          if (!hasClicked) { setShowOpen(false) }
        }}
        ref={setNodeRef}
      >
        <div className={`card overview-card shadow-md p-6 mb-4 rounded-md ${isOver ? "bg-base-300" : "bg-base-100"}`}>

          {showOpen && <button
            className="absolute top-4 right-4 z-10 bg-base-100"
            onPointerDown={() => setIsOpen(true)}
          ><ArrowsOut /></button>}


          <h3 className="mt-0 mb-2 leading-6">{session.title}</h3>
          {session.subtitle && <h4
            className="mt-0 mb-2 opacity-80 leading-5"
          >{session.subtitle}</h4>}

          <hr className="my-2" />

          <div className="flex flex-row items-center">
            <Person />
            <span className="ml-2 h-full my-1" style={{ lineHeight: 1.2 }}>{session.teacher ?? "No Teacher"}</span>
          </div>

          <div className="flex flex-row items-center">
            <Pin />
            <span className="ml-2 h-full my-1" style={{ lineHeight: 1.2 }}>{session.room ?? "No Room"}</span>
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
            {Object.keys(enrollments).sort((a, b) => {
              return (enrollments[a].nickname ?? enrollments[a].name) > (enrollments[b].nickname ?? enrollments[b].name)
                ? 1 : -1;
            }).map(k => <StudentName
              key={enrollments[k].id}
              db={db}
              enrollment={enrollments[k]}
              date={date}
              currentSession={session}
              user={allStudents[enrollments[k].uid as string]}
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


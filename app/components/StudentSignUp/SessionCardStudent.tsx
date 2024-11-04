import { useState, useEffect } from "react"
import { Emoji } from 'emoji-picker-react'

import {
  enrollStudent,
  unenrollFromSession,
} from "../../services"
import { Firestore } from "firebase/firestore"
import { Enrollment, Session, UpsignUser } from "~/types"
import { LockClosedMini } from "~/icons"

type SessionCardStudentProps = {
  db: Firestore,
  selectedDate: Date,
  session: Session,
  userDoc: UpsignUser,
  signupAllowed: boolean,
  userEnrollments: Enrollment[],
  locked?: boolean,
}
const SessionCardStudent = ({
  db,
  selectedDate,
  session,
  userDoc,
  signupAllowed,
  userEnrollments,
  locked,
}: SessionCardStudentProps) => {
  const [isFull, setIsFull] = useState<boolean>(false);
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const [enrollmentFlag, setEnrollmentFlag] = useState<string | null>();
  const [isEnabled, setIsEnabled] = useState<boolean>(true);

  const handleClick = (enrolled: boolean) => {
    if (!userDoc.uid) { return }

    if (signupAllowed && !locked && (!isFull || isEnrolled)) {
      setIsEnabled(false)

      if (enrolled) {
        if (!session.id) { return }
        unenrollFromSession(db, selectedDate, userDoc.uid, session.id).then(() => {
          setIsEnabled(true);
        }).catch(() => setIsEnabled(true));
      } else if ((session.number_enrolled ?? 0) < Number(session.capacity)) {
        enrollStudent(db, selectedDate, session, userDoc).then(() => {
          setIsEnabled(true);
        }).catch(() => setIsEnabled(true));
      }
    }
  }

  useEffect(() => {
    if (isEnrolled) {
      setIsEnabled(true);
    }
  }, [isEnrolled]);

  // When the number_enrolled or capacity updates
  useEffect(() => {
    // Check if the session is full
    if (typeof session.number_enrolled === "number") {
      if (session.number_enrolled >= Number(session.capacity)) {
        setIsFull(true);
      } else {
        setIsFull(false);
      }
    } else {
      setIsFull(false);
    }
  }, [session.number_enrolled, session.capacity]);

  useEffect(() => {
    setIsEnrolled(false);
    setEnrollmentFlag(null);

    for (const e of userEnrollments) {
      if (String(e.session_id) === String(session.id)) {
        setIsEnrolled(true);
        setEnrollmentFlag(e.flag);
      }
    }
  }, [userEnrollments, session.id])

  // Check if filtering changes if the userDoc is updated
  useEffect(() => {
    getIsFiltered();
  }, [userDoc]);

  const getIsFiltered = () => {
    // Make sure the session is shown if the student is enrolled
    if (isEnrolled) {
      return false;
    }

    if (Number(session.capacity) === 0 && !isEnrolled) {
      return true;
    }

    if (!session.restricted_to || session.restricted_to === "") {
      return false;
    }

    if (!Array.isArray(userDoc.groups)) {
      return true;
    }

    let groupBlocking = true;
    // If the session is restricted to an array of groups
    if (Array.isArray(session.restricted_to)) {
      if (session.restricted_to.length === 0) { return false }

      if (session.advanced_restriction_type === "OR") {
        groupBlocking = !session.restricted_to.some(g => userDoc.groups.includes(g));
      } else {
        groupBlocking = !session.restricted_to.every(g => userDoc.groups.includes(g));
      }
    } else {
      // If the session is restricted to something & it's not an empty string
      if (session.restricted_to !== undefined && session.restricted_to !== "") {
        if (Array.isArray(userDoc.groups)) {
          if (userDoc.groups.includes(session.restricted_to)) {
            groupBlocking = false;
          }
        }
        // If the session is restricted to undefined or "", don't block it
      } else {
        groupBlocking = false;
      }

    }

    return groupBlocking;
  }


  if (!signupAllowed && !isEnrolled) {
    return <div />
  }

  if (locked && !isEnrolled) {
    return <div />
  }

  if (getIsFiltered()) {
    return <div />
  }

  return (
    <button
      className={
        `text-left break-inside-avoid p-4 card bg-base-100 border-4 w-full mb-4 shadow-md ${isEnrolled
          ? 'border-primary'
          : 'border-base-100'} ${isFull && !isEnrolled || !isEnabled
            ? 'opacity-70 pointer-events-none'
            : ''}`}
      onClick={() => handleClick(isEnrolled)}
      style={{
        borderRadius: "var(--rounded-btn, 0.5rem)",
      }}
    >
      <div className="w-full">
        {/* Title */}
        <h1 className="font-bold text-lg">
          {/* Flag */}
          {enrollmentFlag && <span style={{ marginRight: '6px', transform: 'translateY(3px)', display: 'inline-block' }}>
            <Emoji unified={enrollmentFlag ?? "1f389"} size={24} />
          </span>}
          {/* Title */}
          {session.title}
          {(locked && signupAllowed) ? <span
            style={{ position: "relative", top: "-2px", left: "4px" }}
          >
            <LockClosedMini />
          </span> : ''}

        </h1>

        {(session.subtitle && session.subtitle !== "undefined") &&
          <h2 className="opacity-80">{session.subtitle}</h2>}
        <hr style={{ margin: '1rem 0' }} />
        <h2>{session.teacher ?? 'No Teacher'}</h2>
        <h2>{session.room ?? 'No Room'}</h2>
        <span className="absolute right-4 bottom-4">
          {session.number_enrolled ?? 0}/{session.capacity}
        </span>
      </div>
    </button>
  )
}

export default SessionCardStudent


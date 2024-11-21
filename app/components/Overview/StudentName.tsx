// TODO: Make sure this is on top while dragging
import { Firestore } from 'firebase/firestore';
import { useMemo, useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Emoji } from 'emoji-picker-react';

import { updateEnrollment } from '../../services';
import { Attendance, Enrollment, Session, UpsignUser } from '~/types';
import { LockClosedMicro, LockOpenMicro, UserQuestion } from '~/icons';

type StudentNameProps = {
  db: Firestore,
  date: Date,
  user: UpsignUser,
  enrollment?: Enrollment,
  groupFilter?: string,
  attendanceFilter?: Attendance[],
  currentSession?: Session,
  isSession?: boolean,
  showBlame?: boolean,
}

const StudentName = ({
  db,
  enrollment,
  date,
  user,
  currentSession,
  groupFilter,
  attendanceFilter,
  isSession,
  showBlame,
}: StudentNameProps) => {
  if (!user) { return <div className="student-name mt-0">Deleted User ({enrollment?.name ?? "No name"})</div> }

  const [isHovering, setIsHovering] = useState<boolean>(false);
  const dragItem = useMemo(() => ({ user, enrollment, currentSession }), [user, enrollment, currentSession]);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `draggable-${user.uid}`,
    data: dragItem,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 3000,
  } : undefined;

  const toggleLock = async () => {
    if (!enrollment) { return }
    const payload = {
      locked: !enrollment.locked
    }

    await updateEnrollment(db, date, enrollment.id ?? "", payload);
  }

  if (!user) { return <></> }
  if (groupFilter && !["All Students", ""].includes(groupFilter)) {
    if (!Array.isArray(user.groups)) { return <></> }
    if (!user.groups.includes(groupFilter)) { return <></> }
  }
  if (
    enrollment?.attendance &&
    attendanceFilter?.length &&
    !attendanceFilter.includes(enrollment.attendance)
  ) {
    return <></>
  }

  return (
    <div
      className="student-name mt-0 cursor-move touch-none w-fit relative"
      key={`enrollment-${user.uid}`}
      onPointerOver={() => setIsHovering(true)}
      onPointerOut={() => setIsHovering(false)}
      ref={setNodeRef}
      style={style
        ? { ...style, marginRight: ((isSession && isHovering) || (isSession && enrollment?.locked)) ? "-16px" : "" }
        : { marginRight: ((isSession && isHovering) || (isSession && enrollment?.locked)) ? "-16px" : "" }}
      {...listeners}
      {...attributes}
    >
      {/* Lock */}
      {isSession && (isHovering || enrollment?.locked) &&
        <span
          className={`material-icons cursor-pointer ${enrollment?.locked ? 'locked' : ''}`}
          onPointerDown={toggleLock}
          style={{
            position: "relative",
            top: "-2px",
            left: "-2px",
          }}
        >
          {enrollment?.locked ? <LockClosedMicro /> : <LockOpenMicro />}
        </span>}

      {/* Name */}
      <span className="mr-1">{user.nickname ?? user.name}</span>

      {/* Blame Signup */}
      {showBlame && (
        <div className="inline pr-1 tooltip">
          <UserQuestion />
          <span className="tooltiptext">Signed up by: {enrollment?.signed_up_by?.uid === enrollment?.uid
            ? 'self'
            : enrollment?.signed_up_by?.name ?? 'OLD APP VERSION'
          }</span>
        </div>
      )}

      {/* Emoji Flag */}
      {enrollment?.flag && <div className="emoji-holder pr-1" style={{ display: 'inline-block', margin: '6px 0 0 0', height: '14px' }}>
        <Emoji unified={enrollment.flag} size={16} />
      </div>}
      {/* Attendance */}
      {enrollment?.attendance
        ? <span>|<span className="ml-1" style={{
          fontWeight: "bold",
          color: enrollment.attendance === "present"
            ? "var(--present)"
            : enrollment.attendance === "tardy"
              ? "var(--tardy)"
              : "var(--absent)"
        }}>
          {enrollment.attendance.charAt(0).toUpperCase() + enrollment.attendance.slice(1)}</span>
        </span>
        : null}

    </div>
  )
}

export default StudentName;


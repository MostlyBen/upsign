import { Firestore } from 'firebase/firestore';
import { useMemo, useState } from 'react';
import { useDrag } from 'react-dnd';
import { Emoji } from 'emoji-picker-react';

import { updateEnrollment } from '../../services';
import { Attendance, Enrollment, Session, UpsignUser } from '~/types';
import { LockClosedMicro } from '~/icons';

type StudentNameProps = {
  db: Firestore,
  date: Date,
  enrollment: Enrollment,
  user: UpsignUser,
  groupFilter?: string,
  attendanceFilter?: Attendance[],
  currentSession?: Session,
  isSession?: boolean,
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
}: StudentNameProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const dragItem = useMemo(() => ({ enrollment, currentSession }), [enrollment, currentSession]);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'student',
    item: dragItem,
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    })
  }), [enrollment, currentSession, date, db]);

  const toggleLock = async () => {
    const payload = {
      locked: !enrollment.locked
    }

    await updateEnrollment(db, date, enrollment.id ?? "", payload)
  }

  if (!user) { return <></> }
  if (groupFilter && !["All Students", ""].includes(groupFilter)) {
    if (!Array.isArray(user.groups)) { return <></> }
    if (!user.groups.includes(groupFilter)) { return <></> }
  }
  if (
    enrollment.attendance &&
    attendanceFilter?.length &&
    !attendanceFilter.includes(enrollment.attendance)
  ) {
    return <></>
  }

  return (
    <div
      ref={drag}
      className="student-name mt-0"
      key={`enrollment-${enrollment.uid}`}
      style={{ opacity: isDragging ? 0.25 : 1, cursor: 'move' }}
      onPointerEnter={() => setIsHovering(true)}
      onPointerLeave={() => setIsHovering(false)}
    >
      {/* Lock */}
      {((isSession && isHovering) || (isSession && enrollment.locked)) &&
        <span
          className={`material-icons cursor-pointer ${enrollment.locked ? 'locked' : ''}`}
          onClick={toggleLock}
          style={{
            position: "relative",
            top: "-2px",
            left: "-4px",
          }}
        >
          <LockClosedMicro />
        </span>}

      {/* Name */}
      <span className="mr-2">{enrollment.nickname ?? enrollment.name}</span>
      {/* Emoji Flag */}
      {enrollment.flag && <div className="emoji-holder pr-2" style={{ display: 'inline-block', margin: '6px 0 0 0', height: '14px' }}>
        <Emoji unified={enrollment.flag} size={16} />
      </div>}
      {/* Attendance */}
      {enrollment.attendance
        ? <span>|<span className="ml-2" style={{
          fontWeight: "bold",
          color: enrollment.attendance === "present"
            ? "rgb(5, 150, 105)"
            : enrollment.attendance === "tardy"
              ? "#B48908"
              : "#CB1A41"
        }}>
          {enrollment.attendance.charAt(0).toUpperCase() + enrollment.attendance.slice(1)}</span>
        </span>
        : null}

    </div>
  )
}

export default StudentName;


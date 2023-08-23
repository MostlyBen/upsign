import { useState } from 'react'
import { useDrag } from 'react-dnd'

import { updateEnrollment } from '../../services'

const StudentName = ({ db, enrollment, date, currentSession, isSession }) => {
  const [isHovering, setIsHovering] = useState(false)

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'student',
    item: {
      enrollment: enrollment,
      currentSession: currentSession,
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    })
  }))

  const toggleLock = async () => {
    const payload = {
      locked: !enrollment.locked
    }

    await updateEnrollment(db, date, enrollment.id, payload)
  }

  return (
    <div
    ref={drag}
    className='student-name'
    key={`enrollment-${enrollment.uid}`}
    style={{ opacity: isDragging ? 0.25 : 1, cursor: 'move', marginBottom: '0.5rem' }}
    onPointerEnter={() => setIsHovering(true)}
    onPointerLeave={() => setIsHovering(false)}
  >
    {/* Name */}
    {enrollment.nickname ?? enrollment.name} {enrollment.attendance
    ? <span style={{margin: "0 0 0 0.5rem"}}>|<span style={{margin: "0 0 0 0.75rem", fontWeight: "500",
    color: enrollment.attendance === "present" ? "#009688" : enrollment.attendance === "tardy" ? "#f9a825" : "#d32f2f"}}>
        {enrollment.attendance.charAt(0).toUpperCase() + enrollment.attendance.slice(1)}</span>
      </span>
    : null}

    {/* Lock */}
    {( (isSession && isHovering) || (isSession && enrollment.locked) ) &&
      <span className={`material-icons student-lock ${enrollment.locked ? 'locked' : ''}`} onClick={toggleLock}>
        lock
      </span>}
  </div>
  )
}

export default StudentName
import { useDrag } from 'react-dnd'

const StudentName = ({ enrollment, currentSession }) => {
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

  return (
    <div
    ref={drag}
    key={`enrollment-${enrollment.uid}`}
    style={{ opacity: isDragging ? 0.25 : 1, cursor: 'move', marginBottom: '0.5rem' }}
  >
    {/* <span className="material-icons">lock</span> */}
    {enrollment.nickname ?? enrollment.name} {enrollment.attendance
    ? <span style={{color: "dimgrey", margin: "0 0 0 0.5rem"}}>|<span style={{margin: "0 0 0 0.75rem", fontWeight: "500",
        color: enrollment.attendance === "present" ? "#009688" : enrollment.attendance === "tardy" ? "#f9a825" : "#d32f2f"}}>
        {enrollment.attendance.charAt(0).toUpperCase() + enrollment.attendance.slice(1)}</span>
      </span>
    : null}
  </div>
  )
}

export default StudentName
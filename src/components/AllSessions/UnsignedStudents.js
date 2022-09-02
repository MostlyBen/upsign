import StudentName from "./StudentName"
import { useDrop } from 'react-dnd'

import { unenrollFromSession } from "../../services"

const UnsignedStudents = ({ db, date, students }) => {
  const [monitor, drop] = useDrop(() => ({
    accept: 'student',
    drop: () => {
      const user = monitor.getItem().enrollment
      unenrollFromSession(db, date, user.uid, user.session_id)
    },
    collect: monitor => (monitor),
  }))

  return (
    <div className="">
      <div className={`card session-card is-enrolled`} ref={drop}>
          {/* Title & Info */}
          <h1>Unsigned Students</h1>
          <hr style={{ margin: '1rem 0' }} />

          {/* Student List */}
          <div className="student-list">
            {Array.isArray(students)
            ? students.map(e => {
              return (
                <StudentName key={`student-list-${e.nickname ?? e.name}`} enrollment={e} currentSession={{}} />
              )
            })
            : <div />}
          </div>
      </div>
    </div>
  )
}

export default UnsignedStudents
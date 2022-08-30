import StudentName from "./StudentName"

const UnsignedStudents = ({ students }) => {

  return (
    <div className="">
      <div className={`card session-card is-enrolled`}>
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
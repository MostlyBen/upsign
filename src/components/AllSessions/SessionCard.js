import { useEffect, useState } from "react"
import { getAllStudents, enrollStudent } from "../../services"
import { useDrop } from 'react-dnd'

import M from 'materialize-css';

import StudentName from "./StudentName"
import { SessionEditor } from "../"

const SessionCard = ({ db, date, session, filter }) => {
  const [filteredEnrollment, setFilteredEnrollment] = useState(session.enrollment)
  const [allStudentRef, setAllStudentRef] = useState()
  const [showOpen, setShowOpen] = useState(false)

  useEffect(() => {
    // This should probably happen on the page level, so it doesn't make this request for every card
    getAllStudents(db, true).then(r => { setAllStudentRef(r) })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Initialize the Modal
  useEffect(() => {
    var modal = document.getElementById(`modal-${session.id}`)
    // eslint-disable-next-line no-unused-vars
    var instances = M.Modal.init(modal, {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if ( filter !== 'All Students' ) {
      const s = []

      if ( Array.isArray(session.enrollment) ) {

        for ( var i = 0; i < session.enrollment.length; i++ ) {
          try {
            if (Array.isArray(allStudentRef[session.enrollment[i].uid].groups)) {
              if ( allStudentRef[session.enrollment[i].uid].groups.includes(filter) ) {
                s.push(session.enrollment[i])
              }
            }
          } catch (err) {
            // console.log(err)
          }
        }
        
      }

      setFilteredEnrollment(s)

    } else {
      setFilteredEnrollment(session.enrollment)
    }
  }, [filter, allStudentRef, session, session.enrollment])


  const [monitor, drop] = useDrop(() => ({
    accept: 'student',
    drop: () => {
      const user = monitor.getItem().enrollment
      enrollStudent(db, date, session, user)
    },
    collect: monitor => (monitor),
  }), [db, date, session])

  if ( Array.isArray(session.enrollment) ) {
    session.enrollment.sort( (a, b) => (a.name > b.name) ? 1 : -1 )
  }

  return (
    <div>
      {/* Session Pop-Up */}
      <div id={`modal-${session.id}`} className="modal teacher-sessions session-card teacher-card">
        <div className="modal-content row">
          { Object.keys(session) !== 0
            ? <SessionEditor key={session.id} session={session} db={db} date={date} />
            : <div /> }
        </div>
      </div>
      <div
        className=""
        onMouseEnter={() => { setShowOpen(true) }}
        onMouseLeave={() => { setShowOpen(false) }}
        style={{
          display: `${filter !== 'All Students' && Array.isArray(filteredEnrollment)
          ? filteredEnrollment.length > 0
            ? ''
            // FIX ME WHEN MULTIPLE FILTERS CAN BE SET
            : session.restricted_to === filter ? '' : 'none'
          : ''}`,
        }}
      >
        <div className={`card session-card`} ref={drop}>
          <div className={`open-session-div
            ${ showOpen
            ? ''
            : 'hidden'
            }`}
          >
              <span
                data-target={`modal-${session.id}`}
                className="modal-trigger material-icons open-session"
              >
                open_in_full
              </span>
            </div>

            {/* Title & Info */}
            <h1 style={{paddingRight: '2rem'}}>{session.title}</h1>
            <hr style={{ margin: '1rem 0' }} />
            <h2>{session.teacher}</h2>
            <h2>{session.room ?? 'No Room'}</h2>

            <hr style={{margin: '1rem 0'}} />

            {/* Student List */}
            <div className="student-list">
              <h2 style={{ margin: '1rem 0', fontWeight: '500' }}>Students</h2>
              <h2 className="capacity-overview">
                {Array.isArray(session.enrollment) ? session.enrollment.length : 0}/{session.capacity}
              </h2>
              <div>
                {Array.isArray(session.enrollment)
                ? filteredEnrollment.map(e => {
                  return (
                    <StudentName key={`student-list-${e.nickname ?? e.name}`} enrollment={e} currentSession={session} />
                  )
                })
                : <div />}
              </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default SessionCard
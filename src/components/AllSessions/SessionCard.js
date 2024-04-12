import { useEffect, useState } from "react"
import { enrollStudent, updateEnrollment } from "../../services"
import { useDrop } from 'react-dnd'

import M from 'materialize-css';

import StudentName from "./StudentName"
import { SessionEditor } from "../"

const SessionCard = ({ db, date, session, filter, groupOptions, allStudents }) => {
  const [filteredEnrollment, setFilteredEnrollment] = useState(session.enrollment)
  // const [allStudentRef, setAllStudentRef] = useState()
  const [showOpen, setShowOpen] = useState(false)
  const [showLock, setShowLock] = useState(false)

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
            if (Array.isArray(allStudents[session.enrollment[i].uid].groups)) {
              if ( allStudents[session.enrollment[i].uid].groups.includes(filter) ) {
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
  }, [filter, allStudents, session, session.enrollment])


  const [monitor, drop] = useDrop(() => ({
    accept: 'student',
    drop: () => {
      const user = monitor.getItem().enrollment
      enrollStudent(db, date, session, user)
    },
    collect: monitor => (monitor),
  }), [db, date, session])

  const handleLockAll = () => {
    let locked = true
    for (var s of session.enrollment) {
      if (!s.locked) {
        locked = false
        break
      }
    }

    for (var t of session.enrollment) {
      updateEnrollment(db, date, t.id, { locked: !locked })
    }
  }

  if ( Array.isArray(session.enrollment) ) {
    session.enrollment.sort( (a, b) => ( ( a.nickname ?? a.name ) > ( b.nickname ?? b.name ) ) ? 1 : -1 )
  }

  return (
    <div>
      {/* Session Pop-Up */}
      <div id={`modal-${session.id}`} className="modal teacher-sessions session-card teacher-card no-shadow">
        <div className="modal-content row">
          { Object.keys(session) !== 0
            ? <SessionEditor key={session.id} session={session} db={db} date={date} groupOptions={groupOptions} hideOptions={true} />
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
                className="modal-trigger material-icons"
              >
                open_in_full
              </span>
            </div>

            {/* Title & Info */}
            <h1 style={{paddingRight: '2rem'}}>{session.title}</h1>
            {(session.subtitle && session.subtitle !== "undefined") && <h2 style={{opacity: 0.8}}>{session.subtitle}</h2>}

            <hr style={{ margin: '1rem 0' }} />

            <h2>
              <span className="material-icons card-icon">person</span>
              {session.teacher}
            </h2>
            <h2>
              <span className="material-icons card-icon">home</span>
              {session.room ?? 'No Room'}
            </h2>

            <hr style={{margin: '1rem 0'}} />

            {/* Student List */}
            <div className="student-list">
              <h2 style={{ margin: '1rem 0', fontWeight: '500' }} onPointerEnter={() => setShowLock(true)} onPointerLeave={() => setShowLock(false)}>
                Students
                {showLock &&
                  <span className={`material-icons student-lock`} onClick={handleLockAll}>
                    lock
                  </span>}
              </h2>
              <h2 className="capacity-overview">
                {Array.isArray(session.enrollment) ? session.enrollment.length : 0}/{session.capacity}
              </h2>
              <div>
                {Array.isArray(session.enrollment)
                ? filteredEnrollment.map(e => {
                  return (
                    <StudentName key={`student-list-${e.nickname ?? e.name}`} db={db} enrollment={e} currentSession={session} date={date} isSession={true} />
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
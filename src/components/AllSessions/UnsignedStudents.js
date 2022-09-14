import { useState, useEffect } from "react"
import { query, collection, onSnapshot } from "@firebase/firestore"
import { useDrop } from 'react-dnd'

import StudentName from "./StudentName"
import LittleLoadingBar from "../SmallBits/LittleLoadingBar"

import { 
  getUnsignedStudents,
  unenrollFromSession,
} from "../../services"

const UnsignedStudents = ({ db, schoolId, date, hour, groupFilter }) => {
  const [ unsignedStudents, setUnsignedStudents ] = useState([])
  const [ loading, setLoading ] = useState(true)

  const updateUnsigned = async (db) => {
    const u = groupFilter === 'All Students'
      ? await getUnsignedStudents(db, date, Number(hour))
      : await getUnsignedStudents(db, date, Number(hour), groupFilter)
      setUnsignedStudents( [...u] )
      setLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    updateUnsigned(db)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupFilter])

  // ENROLLMENTS: Load & subscribe to updates
  useEffect(() => {
    setLoading(true)
    // Set up snapshot & load sessions
    const eQuery = query(
                collection(
                  db,
                  "schools",
                  schoolId,
                  "sessions",
                  String(date.getFullYear()),
                  `${String(date.toDateString())}-enrollments`
                  )
                );
    const unsubscribe = onSnapshot(eQuery, () => {
      updateUnsigned(db)
    })

    return () => unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, date, hour, groupFilter])

  // DnD frame
  const [monitor, drop] = useDrop(() => ({
    accept: 'student',
    drop: () => {
      const user = monitor.getItem().enrollment
      unenrollFromSession(db, date, user.uid, user.session_id)
    },
    collect: monitor => (monitor),
  // Update the drop function when the db or date updates
  }), [db, date])

  return (
    <div className="">
      <div className={`card session-card is-enrolled`} ref={drop}>
          {/* Title & Info */}
          <h1>Unsigned Students</h1>
          <hr style={{ margin: '1rem 0' }} />
          {loading
           ? <LittleLoadingBar />
           : <div className="student-list">
              {Array.isArray(unsignedStudents)
              ? unsignedStudents.map(e => {
                return (
                  <StudentName key={`student-list-${e.nickname ?? e.name}`} enrollment={e} currentSession={{}} />
                )
              })
              : <div />}
            </div>
          }

      </div>
    </div>
  )
}

export default UnsignedStudents
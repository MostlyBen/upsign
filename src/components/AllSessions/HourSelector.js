import { useState, useEffect } from "react"
import { doc, onSnapshot } from "firebase/firestore"
import { Link } from "react-router-dom"

import { getNumberSessions } from "../../services"
import { 
  numberToArrayOfStrings,
} from "../../utils"

const HourSelector = ({ selected, schoolId, db, selectedDate }) => {
  const [hours, setHours] = useState(['1'])

  const updateHours = async (db) => {
    const numberSessions = await getNumberSessions(db, selectedDate)
    const newHours = numberToArrayOfStrings(numberSessions)
    setHours(newHours)
  }


  useEffect(() => {
    // Set up snapshot & load the number of hours
    const d = doc(db, "schools", schoolId, "config", "sessions")
    const unsubscribe = onSnapshot(d, () => {
      updateHours(db)
    })

    return () => unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, selectedDate])

  const activeSelection = selected ?? '1'

  return (
    <div style={{ width: "100%" }}>
      <ul className="pagination" style={{ marginTop: "0", marginBottom: "0" }}>

        {hours.map(hour => {
          return (
            <li
              className={ hour === activeSelection ? "active teal lighten-2" : "waves-effect" }
              key={`${hour}-selector`}
              style={{ width: "100%", height: "3rem", padding: "0.445rem 0" }}
            >
              <Link to={`/overview/${hour}`} style={{fontSize: "2rem", width: "100%"}}>{ hour }</Link>
            </li>
          )
        })}

      </ul>
    </div>
  )
}

export default HourSelector
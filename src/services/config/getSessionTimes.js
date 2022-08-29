import { doc, getDoc, setDoc } from "@firebase/firestore"
import { getSubdomain } from "../../utils"

const getSessionTimes = async (db, selectedDate=null) => {
  const schoolId = getSubdomain()
  const sessionsConfigRef = doc(db, "schools", schoolId, "config", "sessions")
  const sessionConfig = await getDoc(sessionsConfigRef)

  if (sessionConfig.exists()) {
    let times =  sessionConfig.data().times
    // Check if a date was given
    if (selectedDate) {
      // Reference the date's special config
      const dateConfigRef = doc(db, "schools", schoolId, "config", "sessions", "special_days", String(selectedDate.toDateString()))
      const dateConfig = await getDoc(dateConfigRef)

      // Update times if the date has its own config
      if ( dateConfig.exists() ) {
        // Redundant check to make sure the doc has the times set
        times = dateConfig.data().times ?? times
      }
    }

    return times

  } else {
    // Create the config object if it doesn't exist
    const defaultSessionsConfig = {
      number: 5,
      times: [
        "8:30 - 9:35",
        "9:45 - 10:50",
        "11:00 - 12:05 // 11:20 - 12:25",
        "12:35 - 1:40",
        "1:50 - 2:55"
      ]
    }

    const r = await setDoc(sessionsConfigRef, defaultSessionsConfig)
      .then(() => {
        return 5
      })

    return r

  }
}

export default getSessionTimes
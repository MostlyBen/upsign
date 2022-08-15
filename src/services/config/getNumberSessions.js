import { doc, getDoc, setDoc } from "@firebase/firestore"
import { getSubdomain } from "../../utils"

const getNumberSessions = async (db) => {
  const schoolId = getSubdomain()
  const sessionsConfigRef = doc(db, "schools", schoolId, "config", "sessions")
  const sessionConfig = await getDoc(sessionsConfigRef)

  if (sessionConfig.exists()) {
    return sessionConfig.data().number

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

export default getNumberSessions
import { doc, updateDoc } from "@firebase/firestore"
import { getSubdomain } from "../../utils"

const setSessionTimes = async ( db, times ) => {
  const schoolId = getSubdomain()
  const sessionsConfigRef = doc(db, "schools", schoolId, "config", "sessions")
  if (Array.isArray(times)) {
    return await updateDoc(sessionsConfigRef, {times: times})
  }
}

export default setSessionTimes
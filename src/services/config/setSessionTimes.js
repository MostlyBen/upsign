import { doc, updateDoc } from "@firebase/firestore"
import { getSchoolId } from "../../utils"

const setSessionTimes = async ( db, times ) => {
  const schoolId = getSchoolId()
  const sessionsConfigRef = doc(db, "schools", schoolId, "config", "sessions")
  if (Array.isArray(times)) {
    return await updateDoc(sessionsConfigRef, {times: times})
  }
}

export default setSessionTimes
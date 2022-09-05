import { doc, updateDoc } from "@firebase/firestore"
import { getSchoolId } from "../../utils"

const setNumberSessions = async ( db, num ) => {
  const schoolId = getSchoolId()
  const sessionsConfigRef = doc(db, "schools", schoolId, "config", "sessions")
  if (num > 0) {
    return await updateDoc(sessionsConfigRef, {number: num})
  }
}

export default setNumberSessions
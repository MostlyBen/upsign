import { doc, updateDoc } from "@firebase/firestore"
import { getSchoolId } from "../../utils"

const updateSession = async (db, date, session_id, payload, schoolId=null) => {
  if (schoolId === null) {
    schoolId = getSchoolId()
  }
  
  const groupRef = doc(
                        db,
                        "schools",
                        schoolId,
                        "sessions",
                        String(date.getFullYear()),
                        String(date.toDateString()),
                        session_id
                      )

  const res = await updateDoc(groupRef, payload)
  return res
}

export default updateSession
import { doc, deleteDoc } from "@firebase/firestore";
import { getSchoolId } from "../../utils";


const removeTeacherSession = async (db, date, sessionId, schoolId=null) => {
  if (schoolId === null) {
    schoolId = getSchoolId()
  }
  
  var sessionRef = doc(
    db,
    "schools",
    schoolId,
    "sessions",
    String(date.getFullYear()),
    String(date.toDateString()),
    sessionId
  )

  // Remove the doc
  return await deleteDoc(sessionRef)

}

export default removeTeacherSession
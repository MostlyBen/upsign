import { doc, updateDoc } from "@firebase/firestore"
import { getSchoolId } from "../../utils";

// WARNING: this should not be used for updating which session a student is signed up for
// It CAN be used to update attendance, student names & nicknames
export const updateEnrollment = async (db, date, enrollmentId, payload, schoolId=null) => {
  if (schoolId === null) {
    schoolId = getSchoolId()
  }
  
  // Reference the enrollment doc
  const enrRef = doc(
                            db,
                            "schools",
                            schoolId,
                            "sessions",
                            String(date.getFullYear()),
                            `${String(date.toDateString())}-enrollments`,
                            enrollmentId)

  const res = updateDoc(enrRef, payload)
  return res

}

export default updateEnrollment
import { collection, getDocs, query, where } from "@firebase/firestore"
import { getSubdomain } from "../../utils";

const getSessionEnrollments = async (db, date, sessionId, schoolId=null) => {
  if (schoolId === null) {
    schoolId = getSubdomain()
  }
  
  const enrRef = collection(
                            db,
                            "schools",
                            schoolId,
                            "sessions",
                            String(date.getFullYear()),
                            `${String(date.toDateString())}-enrollments`)
  const q = query( enrRef, where("session_id", "==", sessionId) )

  const snapshot = await getDocs(q)
  let enrollments = []

  snapshot.forEach(doc => {
    enrollments.push({
      id: doc.id,
      ...doc.data()
    })

  })

  if (enrollments.length > 0) {
    return enrollments

  } else {
    return []
  }

}

export default getSessionEnrollments
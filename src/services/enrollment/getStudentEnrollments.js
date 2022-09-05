import { collection, getDocs, query, where } from "@firebase/firestore"
import { getSchoolId } from "../../utils";

const getStudentEnrollments = async (db, date, uid, schoolId=null) => {
  if (schoolId === null) {
    schoolId = getSchoolId()
  }
  
  const enrRef = collection(
                            db,
                            "schools",
                            schoolId,
                            "sessions",
                            String(date.getFullYear()),
                            `${String(date.toDateString())}-enrollments`)
  const q = query( enrRef, where("uid", "==", uid) )

  const snapshot = await getDocs(q)
  let enrollments = []

  snapshot.forEach(doc => {
    enrollments.push({
      id: doc.id,
      ...doc.data()
    })

  })

  return enrollments

}

export default getStudentEnrollments
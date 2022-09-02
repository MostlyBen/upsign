import { collection, getDocs, query, where } from "@firebase/firestore"
import { getSubdomain } from "../../utils";

const getHourEnrollments = async (db, date, hour, schoolId=null) => {
  if (schoolId === null) {
    schoolId = getSubdomain()
  }
  
  if (db) {
    const enrRef = collection(
                    db,
                    "schools",
                    schoolId,
                    "sessions",
                    String(date.getFullYear()),
                    `${String(date.toDateString())}-enrollments`
                  )
    const q = query( enrRef, where( "session", "==", Number(hour) ) )

    const snapshot = await getDocs(q)
    let enrollments = []

    snapshot.forEach(doc => {
      enrollments.push({
        id: doc.id,
        ...doc.data()
      })

    })

    return enrollments
  } else {
    return []
  }


}

export default getHourEnrollments
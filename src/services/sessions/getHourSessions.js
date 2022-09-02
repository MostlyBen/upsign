import { collection, query, where, getDocs } from "@firebase/firestore"
import { getSubdomain } from "../../utils";

const getHourSessions = async (db, date, hour, schoolId=null) => {
  if (schoolId === null) {
    schoolId = getSubdomain()
  }
  
  // Query and get the session docs
  const q = query(
              collection(
                db,
                "schools",
                schoolId,
                "sessions",
                String(date.getFullYear()),
                String(date.toDateString())),
              where("session", "==", hour));
  const sessionsSnap = await getDocs(q)

  // Assemble an array to return
  const s = []
  sessionsSnap.forEach(doc => {
    let docData = doc.data()
    // Make sure the session has a title
    if (docData.title) {
      s.push(docData)
    }

  })


  return s

}

export default getHourSessions
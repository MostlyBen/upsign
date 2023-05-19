import { collection, query, where, getDocs } from "@firebase/firestore"
import { getSchoolId } from "../../utils";

const getHourSessions = async (db, date, hour, schoolId=null) => {
  if (schoolId === null) {
    schoolId = getSchoolId()
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
    // Still show if students are signed up
    } else if (docData.number_enrolled > 0) {
      docData.title = "No Title"
      s.push(docData)
    }

  })


  return s

}

export default getHourSessions
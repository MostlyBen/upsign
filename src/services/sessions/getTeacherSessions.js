import { doc, setDoc, collection, query, where, getDocs } from "@firebase/firestore";
import { getNumberSessions } from "../../services";
import { getSchoolId } from "../../utils";


const getTeacherSessions = async (db, date, user, schoolId=null) => {
  if (schoolId === null) {
    schoolId = getSchoolId()
  }
  
  const teacher_id = user.uid;
  const numberSessions = await getNumberSessions(db, date)
  let teacherSessions = []
  let sortedSessions = {}

  const dayRef = collection(
    db,
    "schools",
    schoolId,
    "sessions",
    String(date.getFullYear()),
    String(date.toDateString())
  )
  const q = query( dayRef, where('teacher_id', '==', teacher_id) )
  const snapshot = await getDocs(q)
  snapshot.forEach(doc => {
    teacherSessions.push({
      id: doc.id,
      ...doc.data()
    })
  })

  for (let hour = 1; hour < numberSessions + 1; hour++) {
    let hourSessions = teacherSessions.filter(el => {
      return el.session === hour;
    })

    // Teacher already has session(s)
    if (hourSessions.length > 0) {
      sortedSessions[String(hour)] = hourSessions
    // Teacher does not have session(s)
    } else {
      // Figure out ID
      var sessionId = `${teacher_id}-session-${hour}`
      // Locate doc
      var sessionRef = doc(
                            db,
                            "schools",
                            schoolId,
                            "sessions",
                            String(date.getFullYear()),
                            String(date.toDateString()),
                            sessionId)
      // Empty session object
      var docObject = {
        id: sessionId,
        teacher: user.nickname ?? user.displayName,
        teacher_id: user.uid,
        session: hour,
        capacity: 30,
        number_enrolled: 0,
      }
      // Create the doc
      await setDoc(sessionRef, docObject)
      // Add session for return
      sortedSessions[String(hour)] = [docObject]
    }
  }

  // console.log("Sessions:", sortedSessions)
  return sortedSessions

}

export default getTeacherSessions
import { getDoc, doc, setDoc } from "@firebase/firestore";
import { getNumberSessions } from "../../services";
import { getSubdomain } from "../../utils";


const getTeacherSessions = async (db, date, user, schoolId=null) => {
  if (schoolId === null) {
    schoolId = getSubdomain()
  }
  
  const teacher_id = user.uid;
  const numberSessions = await getNumberSessions(db, date)
  let teacherSessions = []

  // Then, filter the array for each session
  for (let i = 0; i < numberSessions; i++) {
    const sessionId = `${teacher_id}-session-${i+1}`
    const sessionRef = doc(
                            db,
                            "schools",
                            schoolId,
                            "sessions",
                            String(date.getFullYear()),
                            String(date.toDateString()),
                            sessionId)

    const sessionDoc = await getDoc(sessionRef)

    if (sessionDoc.exists()) {
      const s = sessionDoc.data()
      teacherSessions.push(s)

    } else {
      const docObject = {
        id: sessionId,
        teacher: user.nickname ?? user.displayName,
        teacher_id: user.uid,
        session: i + 1,
        capacity: 30,
      }

      await setDoc(sessionRef, docObject)
      teacherSessions.push(docObject)
    }
  }
    return teacherSessions

}

export default getTeacherSessions
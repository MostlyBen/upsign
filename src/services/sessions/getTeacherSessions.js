import { getDoc, doc, setDoc } from "@firebase/firestore";
import { getNumberSessions } from "../../services";
import { getSubdomain } from "../../utils";


const getTeacherSessions = async (db, date, user) => {
  const teacher_id = user.uid;
  const schoolId = getSubdomain()
  const numberSessions = await getNumberSessions(db, date)
  let teacherSessions = []

  for (let i = 0; i < numberSessions; i++) {
    const docId = `${teacher_id}-session-${i+1}`
    const sessionRef = doc(
                            db,
                            "schools",
                            schoolId,
                            "sessions",
                            String(date.getFullYear()),
                            String(date.toDateString()),
                            docId)

    const sessionDoc = await getDoc(sessionRef)

    if (sessionDoc.exists()) {
      const s = sessionDoc.data()
      teacherSessions.push(s)

    } else {
      const docObject = {
        id: docId,
        teacher: user.nickname ?? user.displayName,
        teacher_id: user.uid,
        session: i + 1,
        capacity: 30,
        enrollment: [],
      }

      await setDoc(sessionRef, docObject)
      teacherSessions.push(docObject)
    }
  }
    return teacherSessions

}

export default getTeacherSessions
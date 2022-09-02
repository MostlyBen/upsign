import { collection, addDoc } from "@firebase/firestore"
import { unenrollFromHour } from "../"
import { getSubdomain } from "../../utils";


const enrollStudent = async (db, date, session, user, preventUnenroll = false) => {
  const schoolId = getSubdomain()

  await unenrollFromHour(db, date, user, session.session)

  const enrRef = collection(
                            db,
                            "schools",
                            schoolId,
                            "sessions",
                            String(date.getFullYear()),
                            `${String(date.toDateString())}-enrollments`)
  
  const payload = {
    attendance: '',
    name: user.name,
    session: Number(session.session),
    session_id: session.id,
    teacher_id: session.teacher_id,
    uid: user.uid,
  }

  const res = await addDoc(enrRef, payload)
  return res

}

export default enrollStudent
import { doc, collection, writeBatch, updateDoc, addDoc, increment } from "@firebase/firestore"
import { unenrollFromHour } from "../"
import { getSchoolId } from "../../utils";


const enrollStudent = async (db, date, session, user) => {
  if (!session || !user) {
    console.log("Tried to enroll student without enough info")
    return
  }
  const schoolId = getSchoolId()
  if (db) {
    await unenrollFromHour(db, date, user, session.session)
  }

  const batch = writeBatch(db)

  // Add one to the number enrolled
  const sessionRef = doc(
                         db,
                         "schools",
                         schoolId,
                         "sessions",
                         String(date.getFullYear()),
                         `${String(date.toDateString())}`,
                         session.id
  )

  batch.update(sessionRef, { number_enrolled: increment(1) })
  // updateDoc(sessionRef, { number_enrolled: increment(1) })


  // Update the enrollment
  const enrRef = doc(collection(
    db,
    "schools",
    schoolId,
    "sessions",
    String(date.getFullYear()),
    `${String(date.toDateString())}-enrollments`))
  // Construct the payload
  const payload = {
    attendance: '',
    name: user.name,
    session: Number(session.session),
    session_id: session.id,
    teacher_id: session.teacher_id,
    uid: user.uid,
  }
  // Add the user's nickname to the enrollment
  if (user.nickname) {
    payload.nickname = user.nickname
  }
  // Add the enrollment
  batch.set(enrRef, payload)
  // const res = await addDoc(enrRef, payload)

  const res = await batch.commit()
  return res

}

export default enrollStudent
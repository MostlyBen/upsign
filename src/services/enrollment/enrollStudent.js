import { doc, collection, increment, runTransaction } from "@firebase/firestore"
import { unenrollFromHour } from "../"
import { getSchoolId } from "../../utils";


const enrollStudent = async (db, date, session, user, isTeacher=false) => {
  if (!session || !user) {
    console.log("Tried to enroll student without enough info")
    return
  }
  const schoolId = getSchoolId()
  if (db) {
    await unenrollFromHour(db, date, user, session.session)
  }

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

  try {
    const res = await runTransaction(db, async (transaction) => {
      const targetSession = await transaction.get(sessionRef);
      if (!targetSession.exists()) {
        return Promise.reject("Tried to enroll in a session that doesn't exist");
      }

      if (targetSession.data().number_enrolled >= targetSession.data().capacity && !isTeacher) {
        return Promise.reject("Tried to enroll in a full session");
      }

      transaction.update(sessionRef, { number_enrolled: increment(1) });
      transaction.set(enrRef, payload);
    });

    return res;
  } catch (err) {
    console.error(err);
    return false;
  }

}

export default enrollStudent;

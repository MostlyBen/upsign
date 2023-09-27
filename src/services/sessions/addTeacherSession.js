import { addDoc, updateDoc, collection } from "@firebase/firestore";
import { getSchoolId } from "../../utils";


const addTeacherSession = async (db, date, user, session, schoolId=null) => {
  if (schoolId === null) {
    schoolId = getSchoolId()
  }
  
  var sessionsRef = collection(
    db,
    "schools",
    schoolId,
    "sessions",
    String(date.getFullYear()),
    String(date.toDateString()))

  // Empty session object
  var docObject = {
    teacher: user.nickname ?? user.displayName,
    teacher_id: user.uid,
    session: session,
    capacity: 30,
    number_enrolled: 0,
  }

  // Create the doc
  var docRef = await addDoc(sessionsRef, docObject)
  await updateDoc(docRef, {id: docRef.id})

}

export default addTeacherSession
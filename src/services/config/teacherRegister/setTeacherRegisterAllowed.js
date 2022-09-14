import { doc, setDoc } from "firebase/firestore";
import { getSchoolId } from "../../../utils";

const setTeacherRegisterAllowed = async (db, payload, schoolId=null) => {
  if (schoolId === null) {
    schoolId = getSchoolId()
  }
  
  const teacherRegRef = doc(db, "schools", schoolId, "config", "teacher_register")

  // Just in case I want to just send a boolean instead of a proper payload
  if (typeof payload === "boolean") {
    const res = await setDoc(teacherRegRef, { active: true })
    return res

  } else {
    const res = await setDoc(teacherRegRef, payload)
    return res
  }
  
}

export default setTeacherRegisterAllowed
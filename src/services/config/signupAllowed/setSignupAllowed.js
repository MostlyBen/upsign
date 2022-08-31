import { doc, setDoc } from "firebase/firestore";
import { getSubdomain } from "../../../utils";

const setSignupAllowed = async (db, payload) => {
  const schoolId = getSubdomain()
  const teacherRegRef = doc(db, "schools", schoolId, "config", "student_signup")

  // Just in case I want to just send a boolean instead of a proper payload
  if (typeof payload === "boolean") {
    const res = await setDoc(teacherRegRef, { active: true })
    return res

  } else {
    const res = await setDoc(teacherRegRef, payload)
    return res
  }
  
}

export default setSignupAllowed
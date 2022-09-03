import { doc, getDoc, setDoc } from "firebase/firestore";
import { getSubdomain } from "../../../utils";

const getTeacherRegisterAllowed = async (db, schoolId=null) => {
  if (schoolId === null) {
    schoolId = getSubdomain()
  }
  const teacherRegRef = doc(db, "schools", schoolId, "config", "teacher_register")
  const teacherRegSnap = await getDoc(teacherRegRef)
  if (teacherRegSnap.exists()) {
    const active = teacherRegSnap.data().active
    if (typeof active === "boolean") {
      return active
    } else {
      setDoc(teacherRegRef, {active: true})
      return true
    }
  } else {
    setDoc(teacherRegRef, {active: true})
    return true
  }
}

export default getTeacherRegisterAllowed
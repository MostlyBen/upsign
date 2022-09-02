import { doc, getDoc } from "firebase/firestore";
import { getSubdomain } from "../../../utils";

const getTeacherRegisterAllowed = async (db, schoolId=null) => {
  if (schoolId === null) {
    schoolId = getSubdomain()
  }
  
  const teacherRegRef = doc(db, "schools", schoolId, "config", "teacher_register")
    getDoc(teacherRegRef).then(teacherRegSetting => {
    if (teacherRegSetting.exists()) {
      const active = teacherRegSetting.data().active
      if (typeof active === "boolean") {
        return active
      } else {
        return true
      }
    }
  })
}

export default getTeacherRegisterAllowed
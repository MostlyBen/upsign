import { doc, updateDoc } from "firebase/firestore";
import { getSchoolId } from "../../utils";

const updateUser = async (db, uid, payload, schoolId=null) => {
  if (schoolId === null) {
    schoolId = getSchoolId()
  }
  
  const teacherRegRef = doc(db, "schools", schoolId, "users", uid)

  const res = await updateDoc(teacherRegRef, payload)
  return res
  
}

export default updateUser
import { doc, updateDoc } from "firebase/firestore";
import { getSubdomain } from "../../utils";

const updateUser = async (db, uid, payload, schoolId=null) => {
  if (schoolId === null) {
    schoolId = getSubdomain()
  }
  
  const teacherRegRef = doc(db, "schools", schoolId, "users", uid)

  const res = await updateDoc(teacherRegRef, payload)
  return res
  
}

export default updateUser
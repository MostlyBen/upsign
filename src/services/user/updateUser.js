import { doc, updateDoc } from "firebase/firestore";
import { getSubdomain } from "../../utils";

const updateUser = async (db, uid, payload) => {
  const schoolId = getSubdomain()
  const teacherRegRef = doc(db, "schools", schoolId, "users", uid)

  const res = await updateDoc(teacherRegRef, payload)
  return res
  
}

export default updateUser
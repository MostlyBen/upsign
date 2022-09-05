import { doc, updateDoc, deleteField } from "firebase/firestore";
import { getSchoolId } from "../../utils";

const updateUser = async (db, uid, payload, schoolId=null, shouldDeleteField=false) => {
  if (schoolId === null) {
    schoolId = getSchoolId()
  }
  
  const userRef = doc(db, "schools", schoolId, "users", uid)

  if (shouldDeleteField) {
    let newPayload = {}
    newPayload[payload] = deleteField()
    payload = newPayload
  }
  const res = await updateDoc(userRef, payload)
  return res
  
}

export default updateUser
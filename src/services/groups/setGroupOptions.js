import { doc, updateDoc } from "@firebase/firestore"
import { getSchoolId } from "../../utils"

const setGroupOptions = async (db, groupOptions, schoolId=null) => {
  if (schoolId === null) {
    schoolId = getSchoolId()
  }
  
  const groupRef = doc(db, "schools", schoolId, "config", "student_groups")

  const res = await updateDoc(groupRef, {groups: groupOptions})
  return res
}

export default setGroupOptions
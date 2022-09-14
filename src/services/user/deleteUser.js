import { doc, deleteDoc } from "@firebase/firestore"
import { getSchoolId } from "../../utils"

  const deleteUser = async (db, uid, schoolId=null) => {
    if (schoolId === null) {
      schoolId = getSchoolId()
    }

    const userRef = doc(db, "schools", schoolId, "users", uid)
    
    const res = await deleteDoc(userRef)
    return res
    
  }

  export default deleteUser
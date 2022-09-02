import { doc, getDoc } from "@firebase/firestore"
import { getSubdomain } from "../../utils"

const getUserType = async (db, user, schoolId=null) => {
  if (user) {
    if (schoolId === null) {
      schoolId = getSubdomain()
    }
      
    const userRef = doc(db, "schools", schoolId, "users", user.uid)
    const userDoc = await getDoc(userRef)
  
    return userDoc
  } else {
    return null
  }
}

export default getUserType
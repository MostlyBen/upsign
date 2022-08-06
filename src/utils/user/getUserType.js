import { doc, getDoc } from "@firebase/firestore"
import { schoolId } from "../../config"

const getUserType = async (db, user) => {
  if (user) {
    const userRef = doc(db, "schools", schoolId, "users", user.uid)
    const userDoc = await getDoc(userRef)
  
    return userDoc
  } else {
    return null
  }
}

export default getUserType
import { doc, getDoc } from "@firebase/firestore"

const getUserType = async (db, user) => {
  if (user) {
    const userRef = doc(db, "users", user.uid)
    const userDoc = await getDoc(userRef)
  
    return userDoc
  } else {
    return null
  }
}

export default getUserType
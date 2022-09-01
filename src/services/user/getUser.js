import { doc, getDoc } from "@firebase/firestore"
import { getSubdomain } from "../../utils"

  const getUserDoc = async (db, uid) => {
    const schoolId = getSubdomain()

    const userRef = doc(db, "schools", schoolId, "users", uid)
    const userSnap = await getDoc(userRef)
    if (userSnap.exists()) {
      const user = userSnap.data()
      return user
    } else {
      throw new Error(`Could not find user ${uid}`)
    }
  }

  export default getUserDoc
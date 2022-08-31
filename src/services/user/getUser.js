import { doc, getDoc } from "@firebase/firestore"
import { getSubdomain } from "../../utils"

  const getUserDoc = async (db, uid) => {
    const schoolId = getSubdomain()

    const userRef = doc(db, "schools", schoolId, "users", uid)
    getDoc(userRef)
      .then(userSnap => {
        if (userSnap.exists()) {
          return userSnap.data()
        } else {
          throw new Error(`Could not find user ${uid}`)
        }
      })
  }

  export default getUserDoc
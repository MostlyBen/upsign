import { collection, doc, setDoc } from "@firebase/firestore"
import { getSchoolId } from "../../utils"

const setUserType = async (db, user, type, schoolId=null) => {
  if (schoolId === null) {
    schoolId = getSchoolId()
  }
  
  const userRef = collection(db, "schools", schoolId, "users")
  await setDoc(doc(userRef, user.uid), {
    name: user.displayName,
    email: user.email,
    type: type
  }).then(() => {
    return
  })
}

export default setUserType
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getSchoolId } from "../../../utils";

const getSignupAllowed = async (db, schoolId=null) => {
  if (schoolId === null) {
    schoolId = getSchoolId()
  }
  
  const signupAllowedRef = doc(db, "schools", schoolId, "config", "student_signup")
  const signupAllowedSnap = await getDoc(signupAllowedRef)

  if (signupAllowedSnap.exists()) {
    const active = signupAllowedSnap.data().active
    if (typeof active === "boolean") {
      return active
    } else {
      await setDoc(signupAllowedRef, {active: true})
      return true
    }
  } else {
    await setDoc(signupAllowedRef, {active: true})
    return true
  }
}

export default getSignupAllowed
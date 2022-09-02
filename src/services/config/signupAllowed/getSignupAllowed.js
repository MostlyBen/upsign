import { doc, getDoc } from "firebase/firestore";
import { getSubdomain } from "../../../utils";

const getSignupAllowed = async (db, schoolId=null) => {
  if (schoolId === null) {
    schoolId = getSubdomain()
  }
  
  const signupAllowedRef = doc(db, "schools", schoolId, "config", "student_signup")

  getDoc(signupAllowedRef).then(signupAllowedSetting => {
    if (signupAllowedSetting.exists()) {
      const active = signupAllowedSetting.data().active
      if (typeof active === "boolean") {
        return active
      } else {
        return false
      }
    }
  })
}

export default getSignupAllowed
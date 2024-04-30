import { doc, getDoc, setDoc } from "firebase/firestore";
import { getSchoolId } from "../../../utils";

const getSignupAllowed = async (db, schoolId=null, selectedDate=null) => {
  if (schoolId === null) {
    schoolId = getSchoolId()
  }
  
  const signupAllowedRef = doc(db, "schools", schoolId, "config", "student_signup")
  const signupAllowedSnap = await getDoc(signupAllowedRef)

  if (signupAllowedSnap.exists()) {
    const active = signupAllowedSnap.data().active
    if (typeof active === "boolean") {
      // If active is set, override specific day
      if (active) {
        return true
      }

      if (selectedDate) {
        console.log("Selected date:", selectedDate.toDateString())
        const dateActiveRef = doc(db, "schools", schoolId, "config", "student_signup", "special_days", String(selectedDate.toDateString()))
        const dateActiveSnap = await getDoc(dateActiveRef)
        console.log("Day is active?", dateActiveSnap.exists() ? dateActiveSnap.data().active : false)
        return dateActiveSnap.exists() ? dateActiveSnap.data().active : false
      }

      // No selected date, not active
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
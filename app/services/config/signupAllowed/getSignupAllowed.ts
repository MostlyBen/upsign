import { doc, getDoc, setDoc, Firestore } from "firebase/firestore";
import { getSchoolId } from "../../../utils";

interface SignupAllowedConfig {
  active: boolean;
}

const getSignupAllowed = async (
  db: Firestore, 
  schoolId: string | null = null, 
  selectedDate: Date | null = null
): Promise<boolean> => {
  if (schoolId === null) {
    schoolId = getSchoolId();
  }
  
  const signupAllowedRef = doc(db, `schools/${schoolId}/config/student_signup`);
  const signupAllowedSnap = await getDoc(signupAllowedRef);

  if (signupAllowedSnap.exists()) {
    const data = signupAllowedSnap.data() as SignupAllowedConfig;
    if (typeof data.active === "boolean") {
      // If active is set, override specific day
      if (data.active) {
        return true;
      }

      if (selectedDate) {
        console.log("Selected date:", selectedDate.toDateString());
        const dateActiveRef = doc(db, `schools/${schoolId}/config/student_signup/special_days/${selectedDate.toDateString()}`);
        const dateActiveSnap = await getDoc(dateActiveRef);
        console.log("Day is active?", dateActiveSnap.exists() ? (dateActiveSnap.data() as SignupAllowedConfig).active : false);
        return dateActiveSnap.exists() ? (dateActiveSnap.data() as SignupAllowedConfig).active : false;
      }

      // No selected date, not active
      return data.active;

    } else {
      await setDoc(signupAllowedRef, {active: true});
      return true;
    }
  } else {
    await setDoc(signupAllowedRef, {active: true});
    return true;
  }
}

export default getSignupAllowed;
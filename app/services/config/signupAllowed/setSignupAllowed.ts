import { doc, setDoc, Firestore } from "firebase/firestore";
import { getSchoolId } from "../../../utils";

interface SignupAllowedPayload {
  active: boolean;
}

const setSignupAllowed = async (
  db: Firestore, 
  payload: SignupAllowedPayload | boolean, 
  schoolId: string | null = null
): Promise<void> => {
  if (schoolId === null) {
    schoolId = getSchoolId();
  }
  
  const teacherRegRef = doc(db, `schools/${schoolId}/config/student_signup`);

  if (typeof payload === "boolean") {
    await setDoc(teacherRegRef, { active: payload });
  } else {
    await setDoc(teacherRegRef, payload);
  }
}

export default setSignupAllowed;
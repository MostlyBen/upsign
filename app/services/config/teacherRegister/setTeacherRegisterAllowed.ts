import { doc, setDoc, Firestore } from "firebase/firestore";
import { getSchoolId } from "../../../utils";

interface TeacherRegisterPayload {
  active: boolean;
}

const setTeacherRegisterAllowed = async (
  db: Firestore, 
  payload: TeacherRegisterPayload | boolean, 
  schoolId: string | null = null
): Promise<void> => {
  if (schoolId === null) {
    schoolId = getSchoolId();
  }
  
  const teacherRegRef = doc(db, `schools/${schoolId}/config/teacher_register`);

  if (typeof payload === "boolean") {
    await setDoc(teacherRegRef, { active: payload });
  } else {
    await setDoc(teacherRegRef, payload);
  }
}

export default setTeacherRegisterAllowed;
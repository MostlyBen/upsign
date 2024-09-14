import { doc, getDoc, setDoc, Firestore } from "firebase/firestore";
import { getSchoolId } from "../../../utils";

interface TeacherRegisterConfig {
  active: boolean;
}

const getTeacherRegisterAllowed = async (db: Firestore, schoolId: string | null = null): Promise<boolean> => {
  if (schoolId === null) {
    schoolId = getSchoolId();
  }
  const teacherRegRef = doc(db, `schools/${schoolId}/config/teacher_register`);
  const teacherRegSnap = await getDoc(teacherRegRef);
  if (teacherRegSnap.exists()) {
    const data = teacherRegSnap.data() as TeacherRegisterConfig;
    if (typeof data.active === "boolean") {
      return data.active;
    } else {
      await setDoc(teacherRegRef, {active: true});
      return true;
    }
  } else {
    await setDoc(teacherRegRef, {active: true});
    return true;
  }
}

export default getTeacherRegisterAllowed;
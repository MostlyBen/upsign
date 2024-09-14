import { Firestore, doc, updateDoc } from "firebase/firestore";
import { getSchoolId } from "../../utils";

const setSchoolName = async (db: Firestore, schoolName: string, schoolId: string | null = null): Promise<void> => {
  if (!schoolId) {
    schoolId = getSchoolId();
  }

  const schoolNamesRef = doc(db, `school_names/${schoolId}`);
  await updateDoc(schoolNamesRef, { name: schoolName });
}

export default setSchoolName;
import { Firestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getSchoolId, getDefaultSchoolInfo } from "../../utils";

interface SchoolInfo {
  name: string;
}

const getSchoolName = async (db: Firestore, schoolId: string | null = null): Promise<string> => {
  if (!schoolId) {
    schoolId = getSchoolId();
  }

  const schoolNamesRef = doc(db, `school_names/${schoolId}`);
  const schoolInfoSnap = await getDoc(schoolNamesRef);

  if (schoolInfoSnap.exists()) {
    const schoolInfo = schoolInfoSnap.data() as SchoolInfo;
    if (schoolInfo.name) {
      return schoolInfo.name;
    } else {
      await updateDoc(schoolNamesRef, { name: "unnamed school" });
      return "unnamed school";
    }
  } else {
    const schoolInfo = getDefaultSchoolInfo();
    await setDoc(schoolNamesRef, schoolInfo);
    return "unnamed school";
  }
}

export default getSchoolName;
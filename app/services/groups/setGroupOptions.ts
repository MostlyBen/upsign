import { Firestore, doc, setDoc } from "firebase/firestore";
import { getSchoolId } from "../../utils";


const setGroupOptions = async (db: Firestore, groupOptions: string[], schoolId: string | null = null): Promise<void> => {
  if (schoolId === null) {
    schoolId = getSchoolId();
  }

  const groupRef = doc(db, `schools/${schoolId}/config/student_groups`);

  await setDoc(groupRef, { groups: groupOptions });
}

export default setGroupOptions;

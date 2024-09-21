import { Firestore, doc, setDoc } from "firebase/firestore";
import { getSchoolId } from "../../utils";


const setGroupOptions = async (db: Firestore, userId: string, groupOptions: string[], schoolId: string | null = null): Promise<void> => {
  if (schoolId === null) {
    schoolId = getSchoolId();
  }

  const groupRef = doc(db, `schools/${schoolId}/users/${userId}/user_config/student_groups`);

  await setDoc(groupRef, { groups: groupOptions });
}

export default setGroupOptions;

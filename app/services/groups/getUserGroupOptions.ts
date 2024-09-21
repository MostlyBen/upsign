import { Firestore, doc, getDoc } from "firebase/firestore";
import { getSchoolId } from "../../utils";


const getGroupOptions = async (db: Firestore, userId: string, schoolId: string | null = null): Promise<string[]> => {
  if (schoolId === null) {
    schoolId = getSchoolId();
  }

  const groupRef = doc(db, `schools/${schoolId}/users/${userId}/user_config/student_groups`);
  const groupDoc = await getDoc(groupRef);

  if (groupDoc.exists()) {
    const data = groupDoc.data();
    return data.groups || [];
  } else {
    return [];
  }
}

export default getGroupOptions;


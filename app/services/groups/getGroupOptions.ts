import { Firestore, doc, getDoc } from "firebase/firestore";
import { getSchoolId } from "../../utils";


const getGroupOptions = async (db: Firestore, userId: string | null = null, schoolId: string | null = null): Promise<string[]> => {
  if (schoolId === null) {
    schoolId = getSchoolId();
  }

  const groupRef = doc(db, `schools/${schoolId}/config/student_groups`);
  const groupDoc = await getDoc(groupRef);
  let allGroups = [];

  if (groupDoc.exists()) {
    const data = groupDoc.data();
    allGroups = data.groups || [];
  }

  if (userId) {
    const userGroupRef = doc(db, `schools/${schoolId}/users/${userId}/user_config/student_groups`);
    const userGroupDoc = await getDoc(userGroupRef);

    if (userGroupDoc.exists()) {
      const data = userGroupDoc.data();
      allGroups = allGroups.concat(data.groups || []);
    }
  }

  return allGroups;
}

export default getGroupOptions;


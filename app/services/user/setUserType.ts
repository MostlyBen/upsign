import { doc, getDoc, Firestore } from "@firebase/firestore";
import { getSchoolId } from "../../utils";

interface UserData {
  type?: string;
}

const getUserType = async (db: Firestore, uid: string, schoolId: string | null = null): Promise<string | null> => {
  if (schoolId === null) {
    schoolId = getSchoolId();
  }

  const userRef = doc(db, `schools/${schoolId}/users/${uid}`);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    const userData = userSnap.data() as UserData;
    return userData.type || null;
  } else {
    return null;
  }
};

export default getUserType;

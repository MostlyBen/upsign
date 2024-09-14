import { doc, getDoc, Firestore } from "@firebase/firestore";
import { getSchoolId } from "../../utils";

interface User {
  [key: string]: any;
}

const getUser = async (db: Firestore, uid: string, schoolId: string | null = null): Promise<User | null> => {
  if (schoolId === null) {
    schoolId = getSchoolId();
  }

  const userRef = doc(db, `schools/${schoolId}/users/${uid}`);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    const user = userSnap.data() as User;
    return user;
  } else {
    return null;
  }
};

export default getUser;

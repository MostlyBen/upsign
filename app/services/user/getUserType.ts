import { User } from "firebase/auth";
import { doc, getDoc, Firestore } from "@firebase/firestore";
import { getSchoolId } from "../../utils";


const getUserType = async (
  db: Firestore,
  user: User,
  schoolId: (null | string) = null
): Promise<string | null> => {

  if (schoolId === null) {
    schoolId = getSchoolId();
  }

  const userRef = doc(db, `schools/${schoolId}/users/${user.uid}`);
  const userDoc = await getDoc(userRef);
  if (userDoc.exists()) {
    return userDoc.data().type ?? null;
  } else {
    return null;
  }

}

export default getUserType;

import { doc, deleteDoc, Firestore } from "@firebase/firestore";
import { getSchoolId } from "../../utils";

const deleteUser = async (db: Firestore, uid: string, schoolId: string | null = null): Promise<void> => {
  if (schoolId === null) {
    schoolId = getSchoolId();
  }

  const userRef = doc(db, `schools/${schoolId}/users/${uid}`);
  
  await deleteDoc(userRef);
};

export default deleteUser;

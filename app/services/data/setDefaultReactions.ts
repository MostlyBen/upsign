import { Firestore, doc, setDoc } from "firebase/firestore";
import { getSchoolId } from "../../utils";

const setDefaultReactions = async (db: Firestore, reactions: string[], schoolId: string | null = null): Promise<void> => {
  if (!schoolId) {
    schoolId = getSchoolId();
  }

  const configRef = doc(db, `schools/${schoolId}/config/reactions`);
  await setDoc(configRef, { default: reactions }, { merge: true });
}

export default setDefaultReactions;

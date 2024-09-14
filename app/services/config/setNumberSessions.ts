import { Firestore, doc, updateDoc } from "firebase/firestore";
import { getSchoolId } from "../../utils";

const setNumberSessions = async (db: Firestore, num: number): Promise<void> => {
  const schoolId = getSchoolId();
  const sessionsConfigRef = doc(db, `schools/${schoolId}/config/sessions`);
  if (num > 0) {
    await updateDoc(sessionsConfigRef, { number: num });
  }
}

export default setNumberSessions;
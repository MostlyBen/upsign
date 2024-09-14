import { Firestore, doc, updateDoc } from "firebase/firestore";
import { getSchoolId } from "../../utils";

const setSessionTimes = async (db: Firestore, times: string[]): Promise<void> => {
  const schoolId = getSchoolId();
  const sessionsConfigRef = doc(db, `schools/${schoolId}/config/sessions`);
  if (Array.isArray(times)) {
    await updateDoc(sessionsConfigRef, { times});
  }
}

export default setSessionTimes;
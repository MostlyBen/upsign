import { doc, deleteDoc, Firestore } from "@firebase/firestore";
import { getSchoolId } from "../../utils";

const removeTeacherSession = async (db: Firestore, date: Date, sessionId: string, schoolId: string | null = null): Promise<void> => {
  if (schoolId === null) {
    schoolId = getSchoolId();
  }
  
  const sessionRef = doc(
    db,
    `schools/${schoolId}/sessions/${date.getFullYear()}/${date.toDateString()}/${sessionId}`
  );

  // Remove the doc
  await deleteDoc(sessionRef);
}

export default removeTeacherSession;

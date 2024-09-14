import { doc, updateDoc, Firestore } from "@firebase/firestore";
import { getSchoolId } from "../../utils";

interface SessionPayload {
  [key: string]: any;
}

const updateSession = async (db: Firestore, date: Date, sessionId: string, payload: SessionPayload, schoolId: string | null = null): Promise<void> => {
  if (schoolId === null) {
    schoolId = getSchoolId();
  }
  
  const groupRef = doc(
    db,
    `schools/${schoolId}/sessions/${date.getFullYear()}/${date.toDateString()}/${sessionId}`
  );

  await updateDoc(groupRef, payload);
};

export default updateSession;
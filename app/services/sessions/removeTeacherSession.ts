import { doc, deleteDoc, Firestore, runTransaction, query, where, getDocs, collection } from "@firebase/firestore";
import { getSchoolId } from "../../utils";

const removeTeacherSession = async (
  db: Firestore,
  date: Date,
  sessionId: string,
  schoolId: string | null = null
): Promise<void> => {
  if (schoolId === null) {
    schoolId = getSchoolId();
  }

  const sessionRef = doc(
    db,
    `schools/${schoolId}/sessions/${date.getFullYear()}/${date.toDateString()}/${sessionId}`
  );

  const enrollmentsRef = collection(
    db,
    `schools/${schoolId}/sessions/${date.getFullYear()}/${date.toDateString()}-enrollments`
  );

  // Get all enrollments for this session
  const q = query(enrollmentsRef,
    where("session_id", "==", sessionId)
  );

  const qSnapshot = await getDocs(q);

  // Delete all enrollments and the session
  await runTransaction(db, async (transaction: any) => {
    qSnapshot.forEach(async (snap) => {
      const enrollment = snap.data();
      transaction.delete(snap.ref);
      transaction.delete(doc(enrollmentsRef, enrollment.uid));
    });
    transaction.delete(sessionRef);
  });

}

export default removeTeacherSession;

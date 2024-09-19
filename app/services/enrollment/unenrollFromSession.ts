import { Firestore, doc, collection, query, where, getDocs, increment, runTransaction, DocumentReference, Transaction } from "firebase/firestore";
import { getSchoolId } from "../../utils";

const unenrollFromSession = async (
  db: Firestore,
  date: Date,
  userId: string,
  sessionId: string,
  schoolId: string | null = null
): Promise<void> => {

  if (!sessionId || !userId) {
    return;
  }

  if (schoolId === null) {
    schoolId = getSchoolId();
  }

  // Update the number enrolled in the session doc
  const sessionRef = doc(db, `schools/${schoolId}/sessions/${date.getFullYear()}/${date.toDateString()}/${sessionId}`);

  // Find & remove the enrollment doc
  // Reference the enrollments collection for the day
  const enrRef = collection(db, `schools/${schoolId}/sessions/${date.getFullYear()}/${date.toDateString()}-enrollments`);
  // Query for any docs for this user in this hour
  const q = query(enrRef, where("uid", "==", userId), where("session_id", "==", sessionId));
  // Get all docs that fit the query
  const qSnapshot = await getDocs(q);

  // Iterate through and store refs to existing enrollments
  const existingEnrollments: DocumentReference[] = [];
  qSnapshot.forEach((snap) => {
    existingEnrollments.push(snap.ref);
  });

  try {
    const res = await runTransaction(db, async (transaction: Transaction) => {
      transaction.update(sessionRef, { number_enrolled: increment(-1) });
      for (const existingRef of existingEnrollments) {
        transaction.delete(existingRef);
      }
    });
    return res
  } catch (err) {
    console.error(err);
    Promise.reject(err);
  }
}

export default unenrollFromSession;

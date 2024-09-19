import { Firestore, doc, collection, query, where, getDocs, increment, runTransaction, DocumentReference, Transaction } from "firebase/firestore";
import { getSchoolId } from "../../utils";
import { Enrollment, UpsignUser } from "~/types";

const unenrollFromHour = async (
  db: Firestore,
  date: Date,
  user: UpsignUser | Enrollment,
  hour: number,
  schoolId: string | null = null
): Promise<void> => {
  if (!user.uid || !hour) {
    return;
  }

  if (schoolId === null) {
    schoolId = getSchoolId();
  }

  // Reference the enrollments collection for the day
  const enrRef = collection(db, `schools/${schoolId}/sessions/${date.getFullYear()}/${date.toDateString()}-enrollments`);
  // Query for any docs for this user in this hour
  const q = query(enrRef, where("uid", "==", user.uid), where("session", "==", Number(hour)));
  // Get all docs that fit the query
  const quSnapshot = await getDocs(q);

  // Iterate through and delete any enrollment docs
  const updates: {session: DocumentReference, enrollment: DocumentReference}[] = [];
  quSnapshot.forEach((snap) => {
    // Create a reference to the session the enrollment is for
    const enrData = snap.data();
    const sessionRef = doc(db, `schools/${schoolId}/sessions/${date.getFullYear()}/${date.toDateString()}/${enrData.session_id}`);
    updates.push({
      session: sessionRef,
      enrollment: snap.ref
    });
  });

  try {
    const res = await runTransaction(db, async (transaction: Transaction) => {
      for (const u of updates) {
        transaction.update(u.session, { number_enrolled: increment(-1) });
        transaction.delete(u.enrollment);
      }
    });
    
    return res;

  } catch (err) {
    console.error(err);
    Promise.reject(err);
  }

}

export default unenrollFromHour;

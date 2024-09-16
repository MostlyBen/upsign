import { Firestore, doc, collection, query, where, getDocs, writeBatch, increment } from "firebase/firestore";
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

  const batch = writeBatch(db);

  // Reference the enrollments collection for the day
  const enrRef = collection(db, `schools/${schoolId}/sessions/${date.getFullYear()}/${date.toDateString()}-enrollments`);
  // Query for any docs for this user in this hour
  const q = query(enrRef, where("uid", "==", user.uid), where("session", "==", Number(hour)));
  // Get all docs that fit the query
  const quSnapshot = await getDocs(q);

  // Iterate through and delete any enrollment docs
  quSnapshot.forEach((snap) => {
    // Create a reference to the session the enrollment is for
    const enrData = snap.data();
    const sessionRef = doc(db, `schools/${schoolId}/sessions/${date.getFullYear()}/${date.toDateString()}/${enrData.session_id}`);

    // Subtract one from the session's enrollment count
    batch.update(sessionRef, { number_enrolled: increment(-1) });
    // Delete the enrollment doc
    batch.delete(snap.ref);
  });

  await batch.commit();
}

export default unenrollFromHour;

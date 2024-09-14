import { Firestore, collection, getDocs, query, where } from "firebase/firestore";
import { getSchoolId } from "../../utils";
import { Enrollment } from "~/types";

const getSessionEnrollments = async (db: Firestore, date: Date, sessionId: string, schoolId: string | null = null): Promise<Enrollment[]> => {
  if (schoolId === null) {
    schoolId = getSchoolId();
  }

  const enrRef = collection(db, `schools/${schoolId}/sessions/${date.getFullYear()}/${date.toDateString()}-enrollments`);
  const q = query(enrRef, where("session_id", "==", sessionId));

  const snapshot = await getDocs(q);
  const enrollments: Enrollment[] = [];

  snapshot.forEach(doc => {
    enrollments.push({
      id: doc.id,
      ...doc.data()
    } as Enrollment);
  });

  return enrollments;
}

export default getSessionEnrollments;

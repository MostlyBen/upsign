import { Firestore, collection, getDocs, query, where } from "firebase/firestore";
import { getSchoolId } from "../../utils";
import { Enrollment } from "~/types";

const getStudentEnrollments = async (db: Firestore, date: Date, uid: string, schoolId: string | null = null, hour: number | null): Promise<Enrollment[]> => {
  if (schoolId === null) {
    schoolId = getSchoolId();
  }

  const enrRef = collection(db, `schools/${schoolId}/sessions/${date.getFullYear()}/${date.toDateString()}-enrollments`);
  let q
  if (hour) {
    q = query(enrRef, where("uid", "==", uid), where("session", "==", String(hour)));
  } else {
    q = query(enrRef, where("uid", "==", uid));
  }

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

export default getStudentEnrollments;


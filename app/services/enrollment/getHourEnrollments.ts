import { Firestore, collection, getDocs, query, where } from "firebase/firestore";
import { getSchoolId } from "../../utils";
import { Enrollment } from "../../types";

const getHourEnrollments = async (db: Firestore, date: Date, hour: number, schoolId: string | null = null): Promise<Enrollment[]> => {
  if (schoolId === null) {
    schoolId = getSchoolId();
  }

  if (db) {
    const enrRef = collection(db, `schools/${schoolId}/sessions/${date.getFullYear()}/${date.toDateString()}-enrollments`);
    const q = query(enrRef, where("session", "==", Number(hour)));

    const snapshot = await getDocs(q);
    const enrollments: Enrollment[] = [];

    snapshot.forEach(doc => {
      enrollments.push({
        id: doc.id,
        ...doc.data(),
      } as Enrollment);
    });

    return enrollments;
  } else {
    return [];
  }
}

export default getHourEnrollments;

import { doc, collection, query, where, getDoc, getDocs } from "firebase/firestore";
import { Enrollment, Session, UpsignUser } from "~/types";
import { getSchoolId } from "~/utils";

const getIsLocked = async (
  db: any,
  date: Date,
  hour: number,
  student: UpsignUser,
): Promise<Session | false> => {
  const schoolId = getSchoolId();

  const enrCollectionRef = collection(
    db,
    `schools/${schoolId}/sessions/${date.getFullYear()}/${date.toDateString()}-enrollments`
  );

  const q = query(enrCollectionRef,
    where("uid", "==", student.uid),
    where("session", "==", hour)
  );
  const qSnapshot = await getDocs(q)

  const lockedEnrollments: Enrollment[] = [];

  qSnapshot.forEach(async (snap) => {
    const enrData = snap.data();
    if (enrData.locked) {
      lockedEnrollments.push(enrData as Enrollment);
    }
  });

  if (lockedEnrollments.length > 0) {
    const enr = lockedEnrollments[0];
    const sessionRef = doc(
      db,
      `schools/${schoolId}/sessions/${date.getFullYear()}/${date.toDateString()}/${enr.session_id}`
    );
    const sessionData = await getDoc(sessionRef);
    return sessionData.data() as Session;
  }

  return false;
}

export default getIsLocked;


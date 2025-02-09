import {
  doc,
  collection,
  query,
  where,
  getDocs,
  increment,
  runTransaction,
  getDoc,
  Transaction
} from "firebase/firestore";
import { getSchoolId } from "../../utils";
import { Session, UpsignUser, Enrollment } from "../../types";

const buildEnrollmentPayload = (
  student: UpsignUser,
  session: Session,
  user: UpsignUser
): Enrollment => {
  return {
    attendance: '',
    name: student.nickname ?? student.name,
    session: Number(session.session),
    session_id: session.id,
    teacher_id: session.teacher_id,
    uid: student.uid,
    signed_up_by: { uid: user.uid as string, name: user.nickname ?? user.name },
  }
}

const batchEnroll = async (
  db: any,
  date: Date,
  session: Session,
  students: UpsignUser[],
  user: UpsignUser,
  confirm: ((message: string) => Promise<boolean>) | null,
  start: number = 0,
  batchSize: number = 100,
): Promise<{ success: boolean, error?: any }> => {
  const schoolId = getSchoolId();

  const sessionRef = doc(db, `schools/${schoolId}/sessions/${date.getFullYear()}/${date.toDateString()}/${session.id}`);
  const enrCollectionRef = collection(
    db,
    `schools/${schoolId}/sessions/${date.getFullYear()}/${date.toDateString()}-enrollments`
  );

  for (const student of students.slice(start, start + batchSize)) {
    // Query for any enrollments for this student already has this hour
    const q = query(enrCollectionRef,
      where("uid", "==", student.uid),
      where("session", "==", Number(session.session))
    );
    const qSnapshot = await getDocs(q)

    try {
      await runTransaction(db, async (transaction: Transaction) => {
        const conflicts: Enrollment[] = [];
        let alreadyEnrolled: boolean = false;

        // Delete student's existing enrollment(s)
        qSnapshot.forEach(async (snap) => {
          const enrData = snap.data();
          if (enrData.session_id === session.id) {
            alreadyEnrolled = true;
            return;
          }

          if (enrData.locked && enrData.session_id !== session.id) {
            conflicts.push(enrData as Enrollment);
          }

          const sessionRef = doc(
            db,
            `schools/${schoolId}/sessions/${date.getFullYear()}/${date.toDateString()}/${enrData.session_id}`
          );
          transaction.update(sessionRef, { number_enrolled: increment(-1) })
          transaction.delete(snap.ref);
        });

        if (alreadyEnrolled) {
          return Promise.reject(new Error("Student is already enrolled"));
        }

        if (confirm && conflicts.length > 0) {
          const conflict = conflicts[0];
          const sessionRef = doc(
            db,
            `schools/${schoolId}/sessions/${date.getFullYear()}/${date.toDateString()}/${conflict.session_id}`
          );
          const sessionData = await getDoc(sessionRef);
          const sessionTitle = sessionData.data()?.title ?? "another session";
          const sessionTeacher = sessionData.data()?.teacher;

          const userConfirm = await confirm(
            `${conflicts[0].nickname ?? conflicts[0].name} is locked into ${sessionTitle} with ${sessionTeacher}.`
          );
          if (!userConfirm) { return Promise.reject(new Error("User cancelled")); }
        }

        // Add student's new enrollment
        const enrRef = doc(enrCollectionRef)
        const payload = buildEnrollmentPayload(student, session, user);
        transaction.update(sessionRef, { number_enrolled: increment(1) });
        transaction.set(enrRef, payload);
      });
    } catch (err) {
      console.warn(err);
    }
  }

  if (start + batchSize < students.length) {
    batchEnroll(db, date, session, students, user, confirm, start + batchSize, batchSize);
  }

  return { success: true };

}

export default batchEnroll;


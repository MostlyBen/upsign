import { getDocs, query, where, collection, Firestore, doc, increment, runTransaction, Transaction, DocumentReference } from "firebase/firestore";
import { getSchoolId } from "../../utils";
import { Enrollment, Session, UpsignUser } from "../../types";


const enrollStudent = async (
  db: Firestore,
  date: Date,
  session: Session,
  student: UpsignUser,
  user: UpsignUser,
  isTeacher?: boolean
): Promise<void> => {
  if (!session || !student || !student.uid) {
    console.log("Tried to enroll student without enough info");
    return;
  }

  const schoolId = getSchoolId();

  // Add one to the number enrolled
  const sessionRef = doc(db, `schools/${schoolId}/sessions/${date.getFullYear()}/${date.toDateString()}/${session.id}`);

  // Update the enrollment
  const enrCollectionRef = collection(
    db,
    `schools/${schoolId}/sessions/${date.getFullYear()}/${date.toDateString()}-enrollments`
  )
  const enrRef = doc(enrCollectionRef)
  // Construct the payload
  const payload: Enrollment = {
    attendance: '',
    name: student.name,
    session: Number(session.session),
    session_id: session.id,
    teacher_id: session.teacher_id,
    uid: student.uid,
    signed_up_by: { uid: user.uid as string, name: user.nickname ?? user.name },
  }
  // Add the student's nickname to the enrollment
  if (student.nickname) {
    payload.nickname = student.nickname
  }

  // Query for any docs for this student already has this hour
  const q = query(enrCollectionRef,
    where("uid", "==", student.uid),
    where("session", "==", Number(session.session))
  );

  // Get all docs that fit the query
  const qSnapshot = await getDocs(q)
  // Iterate through and store refs to enrollment & session docs
  const updates: { session: DocumentReference, enrollment: DocumentReference }[] = [];
  qSnapshot.forEach(async (snap) => {
    const enrData = snap.data();
    const sessionRef = doc(db, `schools/${schoolId}/sessions/${date.getFullYear()}/${date.toDateString()}/${enrData.session_id}`);
    updates.push({
      session: sessionRef,
      enrollment: snap.ref
    });
  });

  try {
    const res = await runTransaction(db, async (transaction: Transaction) => {
      const targetSession = await transaction.get(sessionRef);
      if (!targetSession.exists()) {
        return Promise.reject(new Error("Tried to enroll in a session that doesn't exist"));
      }

      if (targetSession.data().number_enrolled >= targetSession.data().capacity && !isTeacher) {
        return Promise.reject(new Error("Tried to enroll in a full session"));
      }

      for (const u of updates) {
        if (u.enrollment) {
          transaction.update(u.session, { number_enrolled: increment(-1) })
          transaction.delete(u.enrollment);
        }
      }

      transaction.update(sessionRef, { number_enrolled: increment(1) });
      transaction.set(enrRef, payload);
    });

    return res;

  } catch (err) {
    console.error(err);
    Promise.reject(err);
  }
}

export default enrollStudent;


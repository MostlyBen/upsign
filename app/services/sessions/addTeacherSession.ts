import { Firestore, addDoc, updateDoc, collection } from "firebase/firestore";
import { getSchoolId } from "../../utils";
import { Session, UpsignUser } from "~/types";

const addTeacherSession = async (
  db: Firestore,
  date: Date,
  user: UpsignUser,
  session: number,
  schoolId: string | null = null
): Promise<void> => {
  if (schoolId === null) {
    schoolId = getSchoolId();
  }

  const sessionsRef = collection(
    db,
    `schools/${schoolId}/sessions/${date.getFullYear()}/${date.toDateString()}`
  );

  const docObject: Session = {
    teacher: user.nickname ?? user.name,
    teacher_id: user.uid,
    session,
    capacity: 30,
    number_enrolled: 0,
    created_at: new Date(),
  };

  const docRef = await addDoc(sessionsRef, docObject);
  await updateDoc(docRef, { id: docRef.id });
}

export default addTeacherSession;

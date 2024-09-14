import { doc, setDoc, collection, query, where, getDocs, Firestore, QueryDocumentSnapshot } from "@firebase/firestore";
import { getNumberSessions } from "../../services";
import { getSchoolId } from "../../utils";
import { User } from "firebase/auth";
import { Session } from '~/types';

interface SortedSessions {
  [hour: string]: Session[];
}

const getTeacherSessions = async (db: Firestore, date: Date, user: User & { nickname?: string }, schoolId: string | null = null): Promise<SortedSessions> => {
  if (schoolId === null) {
    schoolId = getSchoolId();
  }

  const teacherId = user.uid;
  const numberSessions = await getNumberSessions(db, date);
  const teacherSessions: Session[] = [];
  const sortedSessions: SortedSessions = {};

  const dayRef = collection(
    db,
    `schools/${schoolId}/sessions/${date.getFullYear()}/${date.toDateString()}`
  );
  const q = query(dayRef, where('teacher_id', '==', teacherId));
  const snapshot = await getDocs(q);
  snapshot.forEach((doc: QueryDocumentSnapshot) => {
    teacherSessions.push({
      ...doc.data() as Session,
      id: doc.id,
    });
  });

  for (let hour = 1; hour < numberSessions + 1; hour++) {
    const hourSessions = teacherSessions.filter(el => {
      return el.session === hour;
    });

    // Teacher already has session(s)
    if (hourSessions.length > 0) {
      sortedSessions[String(hour)] = hourSessions;
      // Teacher does not have session(s)
    } else {
      // Figure out ID
      const sessionId = `${teacherId}-session-${hour}`;
      // Locate doc
      const sessionRef = doc(
        db,
        `schools/${schoolId}/sessions/${date.getFullYear()}/${date.toDateString()}/${sessionId}`
      );
      // Empty session object
      const docObject: Session = {
        id: sessionId,
        teacher: user.nickname ?? user.displayName ?? '',
        teacher_id: user.uid,
        session: hour,
        capacity: 30,
        number_enrolled: 0,
      };
      // Create the doc
      await setDoc(sessionRef, docObject);
      // Add session for return
      sortedSessions[String(hour)] = [docObject];
    }
  }

  // console.log("Sessions:", sortedSessions)
  return sortedSessions;
};

export default getTeacherSessions;

import { Firestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getSchoolId } from "../../utils";

interface SessionConfig {
  number: number;
  times: string[];
  titles?: string[];
}

const defaultSessionsConfig: SessionConfig = {
  number: 5,
  times: [
    "8:30 - 9:35",
    "9:45 - 10:50",
    "11:00 - 12:05 // 11:20 - 12:25",
    "12:35 - 1:40",
    "1:50 - 2:55"
  ]
};

const getSessionTitles = async (
  db: Firestore,
  selectedDate: Date | null = null
): Promise<string[] | number> => {
  const schoolId = getSchoolId();
  const sessionsConfigRef = doc(db, `schools/${schoolId}/config/sessions`);
  const sessionConfig = await getDoc(sessionsConfigRef);

  if (sessionConfig.exists()) {
    let titles = (sessionConfig.data() as SessionConfig).titles;
    if (selectedDate) {
      const dateConfigRef = doc(db, `schools/${schoolId}/config/sessions/special_days/${selectedDate.toDateString()}`);
      const dateConfig = await getDoc(dateConfigRef);

      if (dateConfig.exists()) {
        titles = (dateConfig.data() as SessionConfig).titles ?? titles;
      }
    }
    return titles || [];
  } else {
    await setDoc(sessionsConfigRef, defaultSessionsConfig);
    return 5;
  }
}

export default getSessionTitles;


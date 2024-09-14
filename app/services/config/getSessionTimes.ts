import { Firestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getSchoolId } from "../../utils";

interface SessionConfig {
  number: number;
  times: string[];
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

const getSessionTimes = async (
  db: Firestore,
  selectedDate: Date | null = null
): Promise<string[]> => {
  const schoolId = getSchoolId();
  const sessionsConfigRef = doc(db, `schools/${schoolId}/config/sessions`);
  const sessionConfig = await getDoc(sessionsConfigRef);

  if (sessionConfig.exists()) {
    let times = (sessionConfig.data() as SessionConfig).times;
    if (selectedDate) {
      const dateConfigRef = doc(db, `schools/${schoolId}/config/sessions/special_days/${selectedDate.toDateString()}`);
      const dateConfig = await getDoc(dateConfigRef);

      if (dateConfig.exists()) {
        times = (dateConfig.data() as SessionConfig).times ?? times;
      }
    }
    return times;
  } else {
    await setDoc(sessionsConfigRef, defaultSessionsConfig);
    return [];
  }
}

export default getSessionTimes;

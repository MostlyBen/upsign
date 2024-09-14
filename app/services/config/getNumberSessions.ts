import { Firestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getSchoolId, getDefaultSessionsConfig } from "../../utils";

interface SessionConfig {
  number: number;
}

const getNumberSessions = async (
  db: Firestore,
  selectedDate: Date | null = null
): Promise<number> => {
  const schoolId = getSchoolId();
  const sessionsConfigRef = doc(db, `schools/${schoolId}/config/sessions`);
  const sessionConfig = await getDoc(sessionsConfigRef);

  if (sessionConfig.exists()) {
    let num = (sessionConfig.data() as SessionConfig).number;
    if (selectedDate) {
      const dateConfigRef = doc(db, `schools/${schoolId}/config/sessions/special_days/${selectedDate.toDateString()}`);
      const dateConfig = await getDoc(dateConfigRef);

      if (dateConfig.exists()) {
        num = (dateConfig.data() as SessionConfig).number ?? num;
      }
    }
    return num;
  } else {
    const defaultSessionsConfig = getDefaultSessionsConfig();
    await setDoc(sessionsConfigRef, defaultSessionsConfig);
    return 5;
  }
}

export default getNumberSessions;


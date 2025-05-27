import { Firestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getSchoolId, getDefaultSessionsConfig } from "../../utils";

interface SessionConfig {
  hour_labels: string[] | null;
}

const getNumberSessions = async (
  db: Firestore,
  selectedDate: Date | null = null
): Promise<string[] | null> => {
  const schoolId = getSchoolId();
  const sessionsConfigRef = doc(db, `schools/${schoolId}/config/sessions`);
  const sessionConfig = await getDoc(sessionsConfigRef);

  if (sessionConfig.exists()) {
    let labels = (sessionConfig.data() as SessionConfig).hour_labels ?? null;
    if (selectedDate) {
      const dateConfigRef = doc(db, `schools/${schoolId}/config/sessions/special_days/${selectedDate.toDateString()}`);
      const dateConfig = await getDoc(dateConfigRef);

      if (dateConfig.exists()) {
        labels = (dateConfig.data() as SessionConfig).hour_labels ?? labels;
      }
    }
    return labels;
  } else {
    const defaultSessionsConfig = getDefaultSessionsConfig();
    await setDoc(sessionsConfigRef, defaultSessionsConfig);
    return null;
  }
}

export default getNumberSessions;


import { Firestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getSchoolId } from "../../utils";

const defaultReactions = ["1f389", "1f90f", "1f345", "1f634"];

interface ReactionsConfig {
  default?: string[];
}

const getDefaultReactions = async (db: Firestore, schoolId: string | null = null): Promise<string[]> => {
  if (!schoolId) {
    schoolId = getSchoolId();
  }

  const configRef = doc(db, `schools/${schoolId}/config/reactions`);
  const configSnap = await getDoc(configRef);

  if (!configSnap.exists()) {
    const payload: ReactionsConfig = { default: defaultReactions };
    await setDoc(configRef, payload);
    return defaultReactions;
  }

  const configData = configSnap.data() as ReactionsConfig;
  
  if (!configData.default) {
    await updateDoc(configRef, { default: defaultReactions });
    return defaultReactions;
  }

  return configData.default;
}

export default getDefaultReactions;

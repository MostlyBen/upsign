import { doc, getDoc, setDoc, Firestore } from "firebase/firestore";
import { getSchoolId } from "../../../utils";

interface DomainRestrictionConfig {
  active: boolean;
  domain: string;
}

const getDomainRestriction = async (db: Firestore, schoolId: string | null = null): Promise<DomainRestrictionConfig> => {
  if (schoolId === null) {
    schoolId = getSchoolId();
  }
  
  // Get the config for domain restrictions
  const domResRef = doc(db, `schools/${schoolId}/config/domain_restriction`);
  const domResDoc = await getDoc(domResRef);
  
  if (domResDoc.exists()) {
    const res = domResDoc.data() as DomainRestrictionConfig;
    return res;
  } else {
    const defaultSettings: DomainRestrictionConfig = { active: false, domain: '' };
    await setDoc(domResRef, defaultSettings);
    return defaultSettings;
  }
}

export default getDomainRestriction;
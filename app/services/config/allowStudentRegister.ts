import { doc, getDoc, setDoc, Firestore } from "firebase/firestore";
import { getSchoolId } from "../../utils";

interface DomainRestrictionConfig {
  active: boolean;
  domain: string;
}

const allowStudentRegister = async (db: Firestore, email: string, schoolId: string | null = null): Promise<boolean> => {
  if (schoolId === null) {
    schoolId = getSchoolId();
  }
  
  const domResRef = doc(db, `schools/${schoolId}/config/domain_restriction`);
  const domResDoc = await getDoc(domResRef);

  if (domResDoc.exists()) {
    const { active, domain } = domResDoc.data() as DomainRestrictionConfig;
    const studentDomain = email.split('@')[1];

    if (active && typeof active === "boolean") {
      return domain === studentDomain;
    }
  } else {
    await setDoc(domResRef, { active: false, domain: '' });
  }

  return true;
}

export default allowStudentRegister;
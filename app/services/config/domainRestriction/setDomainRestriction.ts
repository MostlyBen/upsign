import { doc, setDoc, Firestore } from "firebase/firestore";
import { getSchoolId } from "../../../utils";

interface DomainRestrictionPayload {
  active: boolean;
  domain: string;
}

const setDomainRestriction = async (
  db: Firestore, 
  payload: DomainRestrictionPayload, 
  schoolId: string | null = null
): Promise<void> => {
  if (schoolId === null) {
    schoolId = getSchoolId();
  }
  
  const configRef = doc(db, `schools/${schoolId}/config/domain_restriction`);

  await setDoc(configRef, payload);
}

export default setDomainRestriction;
import { doc, collection, setDoc } from "firebase/firestore";

import { getSchoolId } from "../../../utils";

const setDomainRestriction = async (db, payload, schoolId=null) => {
  if (schoolId === null) {
    schoolId = getSchoolId()
  }
  
  const configRef = collection(db, "schools", schoolId, "config")

  const res = await setDoc(doc(configRef, "domain_restriction"), payload);
  return res
}

export default setDomainRestriction
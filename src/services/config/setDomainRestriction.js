import { doc, collection, setDoc } from "firebase/firestore";

import { getSubdomain } from "../../utils";

const setDomainRestriction = async (db, payload) => {
  const schoolId = getSubdomain()
  const configRef = collection(db, "schools", schoolId, "config")

  const res = await setDoc(doc(configRef, "domain_restriction"), payload);
  return res
}

export default setDomainRestriction
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getSubdomain } from "../../../utils";

const getDomainRestriction = async (db, schoolId=null) => {
  if (schoolId === null) {
    schoolId = getSubdomain()
  }
  
  // Get the config for domain restrictions
  const domResRef = doc(db, "schools", schoolId, "config", "domain_restriction")
  const domResDoc = await getDoc(domResRef)
  if (domResDoc.exists()) {
    const res = domResDoc.data()
    return res

  } else {
    const defaultSettings = { active: false, domain: '' }
    setDoc(domResRef, defaultSettings)
    return defaultSettings
  }

}

export default getDomainRestriction
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getSubdomain } from "../../utils";

const getDomainRestriction = async (db) => {
  const schoolId = getSubdomain()
  // Get the config for domain restrictions
  console.log("Getting domain restriction...")
  const domResRef = doc(db, "schools", schoolId, "config", "domain_restriction")
  getDoc(domResRef).then(domResDoc => {

    if (domResDoc.exists()) {
      // Save the needed variables for easy reference
      const domRes = domResDoc.data().domain

      return domRes

    } else {
      console.log("domResDoc doesn't exist!!!")
      setDoc(doc(db, "schools", schoolId, "config", "domain_restriction"), {
        active: false,
        domain: ''
      })

      return ''
    }
  })
}

export default getDomainRestriction
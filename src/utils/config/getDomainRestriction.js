import { doc, getDoc, setDoc } from "firebase/firestore";

const getDomainRestriction = async (db) => {
  // Get the config for domain restrictions
  console.log("Getting domain restriction...")
  const domResRef = doc(db, "config", "domain_restriction")
  getDoc(domResRef).then(domResDoc => {

    if (domResDoc.exists()) {
      // Save the needed variables for easy reference
      const domRes = domResDoc.data().domain
      console.log("IT WORKS", domRes)

      return domRes

    } else {
      console.log("domResDoc doesn't exist!!!")
      setDoc(doc(db, "config", "domain_restriction"), {
        active: false,
        domain: ''
      })

      return ''
    }
  })
}

export default getDomainRestriction
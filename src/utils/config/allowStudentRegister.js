import { doc, getDoc, setDoc } from "firebase/firestore";

const allowStudentRegister = async (db, email) => {
  // Get the config for domain restrictions
  const domResRef = doc(db, "config", "domain_restriction")
  getDoc(domResRef).then(domResDoc => {
    // Create variable to return
    let allow = true

    if (domResDoc.exists()) {
      // Save the needed variables for easy reference
      const active = domResDoc.data().active
      const domRes = domResDoc.data().domain
      const studentDom = email.split('@')[1]

      // Check if the restriction is active and
      if (typeof active === "boolean") {
        if (active) {
          if (domRes !== studentDom) {
            allow = false
          }
        }
      }

    // Create the config doc if it doesn't exist
    } else {
      setDoc(doc(db, "config", "domain_restriction"), {
        active: false,
        domain: ''
      })
    }

    return allow
  })
}

export default allowStudentRegister
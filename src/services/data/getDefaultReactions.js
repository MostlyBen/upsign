import { doc, getDoc, setDoc, updateDoc } from "@firebase/firestore"
import { getSchoolId } from "../../utils"
const defaultReactions = ["1f389", "1f90f", "1f345", "1f634"]

const getDefaultReactions = async (db, schoolId=null) => {
  if (!schoolId) {
    schoolId = getSchoolId()
  }
  // Reference the setting
  let configRef = doc(
                    db,
                    "schools",
                    schoolId,
                    "config",
                    "reactions"
                  )
  // Get the doc
  let configSnap = await getDoc(configRef)

  // Create the config doc if it doesn't exist
  if (!configSnap.exists()) {
    const payload = {default: defaultReactions}
    setDoc(configRef, payload)
  }
  // Access the data if the doc exists
  let configData = configSnap.data()
  
  // Add the reactions property if it doesn't exist
  if (!configData.default) {
    updateDoc(configRef, {default: defaultReactions})
    return defaultReactions
  }

  return configData.default

}

export default getDefaultReactions

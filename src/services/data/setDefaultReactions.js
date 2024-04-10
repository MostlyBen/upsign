import { doc, getDoc, setDoc, updateDoc } from "@firebase/firestore"
import { getSchoolId } from "../../utils"

const setDefaultReactions = async (db, reactionList, schoolId=null) => {
  if (!schoolId) {
    schoolId = getSchoolId()
  }

  if (!Array.isArray(reactionList)) {
    throw new Error("Tried to update the default reactions to an invalid value (must be Array):", reactionList)
  }

  // Reference the setting
  let configRef = doc(
                    db,
                    "schools",
                    schoolId,
                    "config",
                    "reactions"
                  )
  
  let configSnap = await getDoc(configRef)
  if (configSnap.exists()) {
    const res = await updateDoc( configRef, {default: reactionList} )
    return res
  
  } else {
    const res = await setDoc( configRef, {default: reactionList} )
    return res
  }

}

export default setDefaultReactions

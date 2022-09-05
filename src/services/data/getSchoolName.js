import { doc, getDoc, setDoc, updateDoc } from "@firebase/firestore"
import { getSchoolId, getDefaultSchoolInfo } from "../../utils"

const getSchoolName = async (db, schoolId=null) => {
  if (!schoolId) {
    schoolId = getSchoolId()
  }

  // Get the school info doc
  const schoolNamesRef = doc(db, "school_names", schoolId)
  const schoolInfoSnap = await getDoc(schoolNamesRef)
  // Check to make sure the doc exists
  if (schoolInfoSnap.exists()) {
    const schoolInfo = schoolInfoSnap.data()
    // Make sure the school has a name
    if (schoolInfo.name) {
      return schoolInfo.name
    } else { // Name the school if it doesn't have one
      await updateDoc(schoolNamesRef, {name: "unnamed school"})
      return "unnamed school"
    }

  } else { // If the doc doesn't exist...
    const schoolInfo = getDefaultSchoolInfo()
    await setDoc(schoolNamesRef, schoolInfo)

    return ("unnamed school")
  }
}

export default getSchoolName
import { doc, getDoc, setDoc, updateDoc } from "@firebase/firestore"
import { getSubdomain, getDefaultSchoolInfo } from "../../utils"

const getSchoolName = async (db, schoolId=null) => {
  if (!schoolId) {
    schoolId = getSubdomain()
  }

  // Get the school info doc
  const schoolInfoRef = doc(db, "school_names", schoolId)
  const schoolInfoSnap = await getDoc(schoolInfoRef)
  // Check to make sure the doc exists
  if (schoolInfoSnap.exists()) {
    const schoolInfo = schoolInfoSnap.data()
    // Make sure the school has a name
    if (schoolInfo.name) {
      return schoolInfo.name
    } else { // Name the school if it doesn't have one
      await updateDoc(schoolInfoRef, {name: "unnamed school"})
      return "unnamed school"
    }

  } else { // If the doc doesn't exist...
    const schoolInfo = getDefaultSchoolInfo()
    await setDoc(schoolInfoRef, schoolInfo)

    return ("unnamed school")
  }
}

export default getSchoolName
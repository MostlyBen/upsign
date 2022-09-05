import { doc, updateDoc } from "@firebase/firestore"
import { getSchoolId } from "../../utils"

const setSchoolName = async (db, schoolName, schoolId=null) => {
  if (!schoolId) {
    schoolId = getSchoolId()
  }

  // Get the school info doc
  const schoolNamesRef = doc(db, "school_names", schoolId)
  // Construct the payload
  let payload = {}
  payload[schoolId] = schoolName
  // Update the doc and return the response
  const res = await updateDoc(schoolNamesRef, payload)
  return res
}

export default setSchoolName
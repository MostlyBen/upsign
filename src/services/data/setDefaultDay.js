import { doc, getDoc, setDoc, updateDoc } from "@firebase/firestore"
import { getSchoolId, getDefaultSchoolInfo } from "../../utils"

const setDefaultDay = async (db, defaultDay, schoolId=null) => {
  if (!schoolId) {
    schoolId = getSchoolId()
  }

  let dayOptions = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "today",
    "tomorrow"
  ]

  if (!dayOptions.includes(defaultDay)) {
    throw new Error("Tried to update the default day to an invalid value:", defaultDay)
  }

  // Reference the setting
  let configRef = doc(
                    db,
                    "schools",
                    schoolId,
                    "config",
                    "school_info"
                  )
  
  let configSnap = await getDoc(configRef)
  if (configSnap.exists()) {
    const res = await updateDoc( configRef, {default_day: defaultDay} )
    return res
  
  } else {
    let defaultInfo = getDefaultSchoolInfo()
    defaultInfo.default_day = defaultDay
    const res = await setDoc( configRef, defaultInfo )
    return res
  }

}

export default setDefaultDay
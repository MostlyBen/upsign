import { doc, getDoc, setDoc, updateDoc } from "@firebase/firestore"
import { getSchoolId, getDefaultSchoolInfo } from "../../utils"

const getDefaultDay = async (db, schoolId=null) => {
  if (!schoolId) {
    schoolId = getSchoolId()
  }
  // Initialize the variable
  let defaultDay
  // Set up an object to translate the setting to a number
  let dayTranslation = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  }
  // Reference the setting
  let configRef = doc(
                    db,
                    "schools",
                    schoolId,
                    "config",
                    "school_info"
                  )
  // Get the doc
  let configSnap = await getDoc(configRef)

  // Create the config doc if it doesn't exist
  if (!configSnap.exists()) {
    const payload = getDefaultSchoolInfo()
    setDoc(configRef, payload)
    defaultDay = "today"
  }
  // Add the default_day property if it doesn't exist
  let configData = configSnap.data()
  if (!configData.default_day) {
    updateDoc(configRef, {default_day: "today"})
    defaultDay = "today"
  } else {
    defaultDay = configData.default_day
  }

  const d = new Date()

  if (defaultDay === "today") {
    return d

  } else if (defaultDay === "tomorrow") {
    const tomorrow = new Date(d)
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow
  
  } else { // defaultDay is a day of the week
    let day = d.getDay()
    let defaultDayNumber = dayTranslation[defaultDay]
    if (day === defaultDayNumber) {
      return d
    } else {
      const dateCopy = new Date(d.getTime())
      const dateForReturn = new Date(
        dateCopy.setDate(
          dateCopy.getDate() + ((7 - dateCopy.getDay() + defaultDayNumber) % 7 || 7)
        )
      )

      return dateForReturn
    }
  }

}

export default getDefaultDay
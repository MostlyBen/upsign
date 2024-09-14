import { doc, getDoc, setDoc, updateDoc, Firestore } from "@firebase/firestore";
import { getSchoolId, getDefaultSchoolInfo } from "../../utils";

interface DefaultDayResult {
  defaultDay: Date | string;
}

const getDefaultDay = async (
  db: Firestore,
  schoolId: string | null = null,
  asString: boolean = false
): Promise<DefaultDayResult['defaultDay']> => {
  if (!schoolId) {
    schoolId = getSchoolId();
  }
  // Initialize the variable
  let defaultDay: string;
  // Set up an object to translate the setting to a number
  const dayTranslation: { [key: string]: number } = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };
  // Reference the setting
  const configRef = doc(db, `schools/${schoolId}/config/school_info`);
  // Get the doc
  const configSnap = await getDoc(configRef);

  // Create the config doc if it doesn't exist
  if (!configSnap.exists()) {
    const payload = getDefaultSchoolInfo();
    await setDoc(configRef, payload);
    defaultDay = "today";
  } else {
    // Add the default_day property if it doesn't exist
    const configData = configSnap.data();

    if (!configData?.default_day) {
      await updateDoc(configRef, { default_day: "today" });
      defaultDay = "today";
    } else {
      defaultDay = configData.default_day;
    }
  }

  if (asString) {
    return defaultDay;
  }

  const d = new Date();

  if (defaultDay === "today") {
    return d;
  } else if (defaultDay === "tomorrow") {
    const tomorrow = new Date(d);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  } else { // defaultDay is a day of the week
    const day = d.getDay();
    const defaultDayNumber = dayTranslation[defaultDay];
    if (day === defaultDayNumber) {
      return d;
    } else {
      const dateCopy = new Date(d.getTime());
      const dateForReturn = new Date(
        dateCopy.setDate(
          dateCopy.getDate() + ((7 - dateCopy.getDay() + defaultDayNumber) % 7 || 7)
        )
      );

      return dateForReturn;
    }
  }
};

export default getDefaultDay;

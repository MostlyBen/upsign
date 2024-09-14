import { Firestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getSchoolId, getDefaultSchoolInfo } from "../../utils";
import { DefaultDayOption } from "~/types";


const setDefaultDay = async (db: Firestore, defaultDay: DefaultDayOption, schoolId: string | null = null): Promise<void> => {
  if (!schoolId) {
    schoolId = getSchoolId();
  }

  const dayOptions: DefaultDayOption[] = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "today",
    "tomorrow"
  ];

  if (!dayOptions.includes(defaultDay)) {
    throw new Error(`Tried to update the default day to an invalid value: ${defaultDay}`);
  }

  const configRef = doc(db, `schools/${schoolId}/config/school_info`);

  const configSnap = await getDoc(configRef);
  if (configSnap.exists()) {
    await updateDoc(configRef, { default_day: defaultDay });
  } else {
    const defaultInfo = getDefaultSchoolInfo();
    defaultInfo.default_day = defaultDay;
    await setDoc(configRef, defaultInfo);
  }
}

export default setDefaultDay;

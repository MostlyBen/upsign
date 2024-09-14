import { Firestore, doc, updateDoc } from "firebase/firestore";
import { getSchoolId } from "../../utils";

interface EnrollmentPayload {
  [key: string]: any;
}

// WARNING: this should not be used for updating which session a student is signed up for
// It CAN be used to update attendance, student names & nicknames
const updateEnrollment = async (
  db: Firestore,
  date: Date,
  enrollmentId: string,
  payload: EnrollmentPayload,
  schoolId: string | null = null
): Promise<void> => {
  if (schoolId === null) {
    schoolId = getSchoolId();
  }

  // Reference the enrollment doc
  const enrRef = doc(
    db,
    `schools/${schoolId}/sessions/${date.getFullYear()}/${date.toDateString()}-enrollments/${enrollmentId}`
  );

  const res = await updateDoc(enrRef, payload);
  return res;
}

export default updateEnrollment;

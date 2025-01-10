import { Firestore, doc, updateDoc } from "firebase/firestore";
import { getAnalytics, logEvent } from "firebase/analytics";
import { getSchoolId } from "../../utils";
import { UpsignUser } from "~/types";

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
  schoolId: string | null = null,
  user?: UpsignUser,
): Promise<void> => {
  if (schoolId === null) {
    schoolId = getSchoolId();
  }

  if (user) {
    const analytics = getAnalytics();
    logEvent(analytics, 'update_enrollment', {
      payload,
      user,
    });
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

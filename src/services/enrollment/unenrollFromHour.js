import { doc, collection, query, where, getDocs, updateDoc, deleteDoc, increment } from "@firebase/firestore"
import { getSchoolId } from "../../utils";

const unenrollFromHour = async (db, date, user, hour, schoolId=null) => {
  if (!user.uid || !hour) {
    return
  }

  if (schoolId === null) {
    schoolId = getSchoolId()
  }
  
  // Reference the enrollments collection for the day
  const enrRef = collection(
                            db,
                            "schools",
                            schoolId,
                            "sessions",
                            String(date.getFullYear()),
                            `${String(date.toDateString())}-enrollments`)
  // Query for any docs for this user in this hour
  const q = query(enrRef,
                  where("uid", "==", user.uid),
                  where("session", "==", Number(hour))
                  );
  // Get all docs that fit the query
  const quSnapshot = await getDocs(q)

  // Iterate through and delete any enrollment docs
  quSnapshot.forEach(async (snap) => {
    // Create a reference to the session the enrollment is for
    var enrData = snap.data()
    var sessionRef = doc(
                         db,
                         "schools",
                         schoolId,
                         "sessions",
                         String(date.getFullYear()),
                         `${String(date.toDateString())}`,
                         enrData.session_id
    )

    // Subtract one from the session's enrollment count
    await updateDoc(sessionRef, { number_enrolled: increment(-1) })
    // Delete the enrollment doc
    await deleteDoc(snap.ref)
  })

}

export default unenrollFromHour
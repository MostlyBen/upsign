import { collection, query, where, getDocs, deleteDoc } from "@firebase/firestore"
import { getSubdomain } from "../../utils";

export const unenrollFromSession = async (db, date, userId, sessionId, schoolId=null) => {
  if (!sessionId || !userId) {
    return
  }

  if (schoolId === null) {
    schoolId = getSubdomain()
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
                  where("uid", "==", userId),
                  where("session_id", "==", sessionId)
                  );
  // Get all docs that fit the query
  const qSnapshot = await getDocs(q)

  // Iterate through and delete any enrollment docs
  qSnapshot.forEach(async (snap) => {
    await deleteDoc(snap.ref)
  })

}

export default unenrollFromSession
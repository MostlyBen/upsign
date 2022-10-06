import { doc, collection, query, where, getDocs, writeBatch, increment } from "@firebase/firestore"
import { getSchoolId } from "../../utils";

export const unenrollFromSession = async (db, date, userId, sessionId, schoolId=null) => {
  if (!sessionId || !userId) {
    return
  }

  if (schoolId === null) {
    schoolId = getSchoolId()
  }

  const batch = writeBatch(db)

  // Update the number enrolled in the session doc
  const sessionRef = doc(
                         db,
                         "schools",
                         schoolId,
                         "sessions",
                         String(date.getFullYear()),
                         `${String(date.toDateString())}`,
                         sessionId
  )

  batch.update(sessionRef, { number_enrolled: increment(-1) })
  // await updateDoc(sessionRef, { number_enrolled: increment(-1) })


  // Find & remove the enrollment doc
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
    batch.delete(snap.ref)
    // await deleteDoc(snap.ref)
  })
  
  const res = batch.commit()
  return res

}

export default unenrollFromSession
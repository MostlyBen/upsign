import { collection, query, where, getDocs, deleteDoc } from "@firebase/firestore"
import { getSubdomain } from "../../utils";

export const unenrollFromHour = async (db, date, user, hour, schoolId=null) => {
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
                  where("uid", "==", user.uid),
                  where("session", "==", Number(hour))
                  );
  // Get all docs that fit the query
  const quSnapshot = await getDocs(q)

  // Iterate through and delete any enrollment docs
  quSnapshot.forEach(async (snap) => {
    await deleteDoc(snap.ref)
  })

}

export default unenrollFromHour
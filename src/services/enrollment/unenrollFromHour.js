import { collection, query, where, getDocs, doc, setDoc } from "@firebase/firestore"
import { getSubdomain } from "../../utils";

export const unenrollFromHour = async (db, date, user, hour) => {
  const userObject = {
    name: user.nickname ?? user.displayName ?? user.name,
    uid: user.uid,
  }

  const schoolId = getSubdomain()

  const sessionRef = collection(db, "schools", schoolId, "sessions", String(date.getFullYear()), String(date.toDateString()))
  const q = query(sessionRef,
    where("enrollment", "array-contains-any", [
      userObject,
      {attendance: 'absent', ...userObject},
      {attendance: 'tardy', ...userObject},
      {attendance: 'present', ...userObject},
      {attendance: '', ...userObject},
    ]),
    where("session", "==", hour)
    )

  const querySnapshot = await getDocs(q)

  querySnapshot.forEach((res) => {
    let docObject = res.data()

    if (Array.isArray(docObject.enrollment)) {
      for (var i = 0; i < docObject.enrollment.length; i++) {
        if (String(docObject.enrollment[i].uid) === String(user.uid)) {
          docObject.enrollment.splice(i, 1)
          setDoc(doc(db, "schools", schoolId, "sessions", String(date.getFullYear()), String(date.toDateString()), res.id), {
            ...docObject
          })
        }
      }
    }
  })
}

export default unenrollFromHour
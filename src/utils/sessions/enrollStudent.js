import { collection, query, where, getDoc, getDocs, doc, setDoc } from "@firebase/firestore"
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

const enrollStudent = async (db, date, session, user, preventUnenroll = false) => {
  const schoolId = getSubdomain()
  const docRef = doc(db, "schools", schoolId, "sessions", String(date.getFullYear()), String(date.toDateString()), session.id)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    await unenrollFromHour(db, date, user, session.session)
    const sessionData = docSnap.data()

    let tempEnrollment = []
    let alreadyEnrolled = false

    // If anyone's enrolled yet
    if (Array.isArray(sessionData.enrollment)) {
      tempEnrollment = sessionData.enrollment
      // See if student is already enrolled
      for (var i = 0; i < tempEnrollment.length; i++) {
        if (String(tempEnrollment[i].uid) === String(user.uid)) {
          alreadyEnrolled = true
          tempEnrollment.splice(i, 1)
        }
      }
    }

    if (!alreadyEnrolled || preventUnenroll) {
      tempEnrollment.push({
        uid: user.uid,
        name: user.nickname ?? user.displayName ?? user.name,
      })
    }

    // Update the doc in the database
    // SHOULD PROBABLY SWITCH TO UPDATEDOC
    setDoc(doc(db, "schools", schoolId, "sessions", String(date.getFullYear()), String(date.toDateString()), session.id), {
      enrollment: tempEnrollment,
      ...sessionData
    })

  } else {
    console.error("Could not find session in database!")
  }

}

export default enrollStudent
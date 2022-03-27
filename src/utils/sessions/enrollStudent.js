import { collection, query, where, getDoc, getDocs, doc, setDoc } from "@firebase/firestore"

export const unenrollFromHour = async (db, user, hour) => {
  const userObject = {
    name: user.nickname ?? user.displayName ?? user.name,
    uid: user.uid,
  }


  const sessionRef = collection(db, "sessions")
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
          setDoc(doc(db, "sessions", res.id), {
            ...docObject
          })
        }
      }
    }
  })
}

const enrollStudent = async (db, session, user, preventUnenroll = false) => {
  const docRef = doc(db, "sessions", session.id)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    await unenrollFromHour(db, user, session.session)
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
    setDoc(doc(db, "sessions", session.id), {
      enrollment: tempEnrollment,
      ...sessionData
    })

  } else {
    console.error("Could not find session in database!")
  }

}

export default enrollStudent
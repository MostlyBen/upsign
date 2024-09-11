import { getDocs, query, where, doc, collection, increment, runTransaction } from "@firebase/firestore";
import { getSchoolId } from "../../utils";

const enrollStudent = async (db, date, session, user, isTeacher=false) => {
  if (!session || !user) {
    console.log("Tried to enroll student without enough info")
    return
  }
  const schoolId = getSchoolId()

  // Add one to the number enrolled
  const sessionRef = doc(
                         db,
                         "schools",
                         schoolId,
                         "sessions",
                         String(date.getFullYear()),
                         `${String(date.toDateString())}`,
                         session.id
  )

  // Update the enrollment
  const enrCollectionRef = collection(
    db,
    "schools",
    schoolId,
    "sessions",
    String(date.getFullYear()),
    `${String(date.toDateString())}-enrollments`)
  const enrRef = doc(enrCollectionRef)
  // Construct the payload
  const payload = {
    attendance: '',
    name: user.name,
    session: Number(session.session),
    session_id: session.id,
    teacher_id: session.teacher_id,
    uid: user.uid,
  }
  // Add the user's nickname to the enrollment
  if (user.nickname) {
    payload.nickname = user.nickname
  }

  // Query for any docs for this user already has this hour
  const q = query(enrCollectionRef,
    where("uid", "==", user.uid),
    where("session", "==", Number(session.session))
  );
  console.log("q:", q)

  // Get all docs that fit the query
  const qSnapshot = await getDocs(q)
  // Iterate through and store refs to enrollment & session docs
  const existingEnrollments = [];
  qSnapshot.forEach(async (snap) => {
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
    existingEnrollments.push({
      enrollmentRef: snap.ref,
      sessionRef: sessionRef,
    })
  });

  try {
    const res = await runTransaction(db, async (transaction) => {
      const targetSession = await transaction.get(sessionRef);
      if (!targetSession.exists()) {
        return Promise.reject("Tried to enroll in a session that doesn't exist");
      }

      if (targetSession.data().number_enrolled >= targetSession.data().capacity && !isTeacher) {
        return Promise.reject("Tried to enroll in a full session");
      }

      for (var e of existingEnrollments) {
        transaction.update(e.sessionRef, { number_enrolled: increment(-1) });
        transaction.delete(e.enrollmentRef);
      }

      transaction.update(sessionRef, { number_enrolled: increment(1) });
      transaction.set(enrRef, payload);
    });

    return res;
  } catch (err) {
    console.error(err);
    return false;
  }

}

export default enrollStudent;

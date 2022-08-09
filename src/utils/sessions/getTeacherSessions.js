import { collection, query, where, getDocs, doc, setDoc } from "@firebase/firestore";
import { getSubdomain } from "../../utils";

const createMissingTeacherSessions = (db, date, user, currentSessions) => {
  const schoolId = getSubdomain()
  const sessionRef = collection(db, "schools", schoolId, "sessions", String(date.getFullYear()), String(date.toDateString()))

  for (var i = 0; i < 5; i++) {
    var found = false;
    for (var j = 0; j < currentSessions.length; j++) {
      if (Number(currentSessions[j].session) === Number(i+1)) {
        found = true;
        break;
      }
    }

    if (!found) {
      setDoc(doc(sessionRef), {
        teacher: user.nickname ?? user.displayName,
        teacher_id: user.uid,
        session: i+1,
        capacity: 30,
        enrollment: [],
      })
    }
  }
}

const getTeacherSessions = async (db, date, user) => {
  const teacher_id = user.uid;
  const schoolId = getSubdomain()
  
  const q = query(collection(db, "schools", schoolId, "sessions", String(date.getFullYear()), String(date.toDateString())), where("teacher_id", "==", teacher_id));
  const sessions = await getDocs(q)
    .then(querySnapshot => {
      const s = []
      querySnapshot.forEach((doc) => {
        s.push({
          id: doc.id,
          ...doc.data()
        })
      });

      return s
    })
    .then(s => {
      s.sort((a, b) => (a.session > b.session) ? 1: -1 )
      if (s.length < 5) {
        createMissingTeacherSessions(db, date, user, s)
      }
      return s 
    })

    return sessions

}

export default getTeacherSessions
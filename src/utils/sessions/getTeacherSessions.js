import { collection, query, where, getDocs, doc, setDoc } from "@firebase/firestore"

const createMissingTeacherSessions = (db, user, currentSessions) => {
  const sessionRef = collection(db, "sessions")

  for (var i = 0; i < 7; i++) {
    var found = false;
    for (var j = 0; j < currentSessions.length; j++) {
      if (Number(currentSessions[j].session) === Number(i+1)) {
        found = true;
        break;
      }
    }
    if (!found) {
      setDoc(doc(sessionRef), {
        teacher: user.displayName,
        teacher_id: user.uid,
        session: i+1,
        capacity: 30,
      })
    }
  }
}

const getTeacherSessions = async (db, user) => {
  const teacher_id = user.uid;

  const q = query(collection(db, "sessions"), where("teacher_id", "==", teacher_id));
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
      if (s.length < 7) {
        createMissingTeacherSessions(db, user, s)
      }
      return s 
    })

    return sessions

}

export default getTeacherSessions
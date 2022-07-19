import { collection, query, where, getDocs } from "@firebase/firestore"

const getHourSessions = async (db, date, hour) => {

  const q = query(collection(db, "sessions", String(date.getFullYear()), String(date.toDateString())), where("session", "==", hour)/*, where("capacity", "!=", 0)*/);
  const sessions = await getDocs(q)
    .then(querySnapshot => {
      const s = []
      querySnapshot.forEach((doc) => {
        if (doc.data().title) {
          s.push({
            id: doc.id,
            ...doc.data()
          })
        }
      });

      return s
    })

    return sessions

}

export default getHourSessions
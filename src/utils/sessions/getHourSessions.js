import { collection, query, where, getDocs } from "@firebase/firestore"

const getHourSessions = async (db, hour) => {

  const q = query(collection(db, "sessions"), where("session", "==", hour));
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
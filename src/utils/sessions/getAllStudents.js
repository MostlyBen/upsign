import { collection, query, where, getDocs } from "@firebase/firestore"

const getAllStudents = async (db) => {
  const studentQuery = query(collection(db, "users"), where("type", "==", "student"));
  const allStudents = await getDocs(studentQuery)
    .then(querySnapshot => {
      const s = []
      querySnapshot.forEach((doc) => {
        if (doc.data()) {
          s.push({
            uid: doc.id,
            ...doc.data(),
          })
        }
      });

      return s
    });

  return allStudents

}

export default getAllStudents
import { collection, query, where, getDocs } from "@firebase/firestore"
import { getSubdomain } from "../../utils";

const getAllStudents = async (db, asDictionary = false) => {
  const schoolId = getSubdomain()
  const studentQuery = query(collection(db, "schools", schoolId, "users"), where("type", "==", "student"));
  const allStudents = await getDocs(studentQuery)
    .then(querySnapshot => {
      if (!asDictionary) {
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
      } else {
        const s = {}
        querySnapshot.forEach((doc) => {
          if (doc.data()) {
            s[doc.id] = doc.data()
          }
        })
        
        return s
      }

    });

  return allStudents

}

export default getAllStudents
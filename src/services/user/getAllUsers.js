import { collection, getDocs } from "@firebase/firestore"
import { getSchoolId } from "../../utils";

const getAllUsers = async (db, asDictionary = false) => {
  const schoolId = getSchoolId()
  const userQuery = collection(db, "schools", schoolId, "users");
  const allUsers = await getDocs(userQuery)
    .then(querySnapshot => {
      if (!asDictionary) {
        const u = []
        querySnapshot.forEach((doc) => {
          if (doc.data()) {
            u.push({
              uid: doc.id,
              ...doc.data(),
            })
          }
        });
  
        return u
      } else {
        const u = {}
        querySnapshot.forEach((doc) => {
          if (doc.data()) {
            u[doc.id] = doc.data()
          }
        })
        
        return u
      }

    });

  return allUsers

}

export default getAllUsers
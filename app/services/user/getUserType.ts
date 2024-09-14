import { User } from "firebase/auth";
import { doc, getDoc, Firestore, collection, query, where, getDocs } from "@firebase/firestore";
import { getSchoolId } from "../../utils";


const getUserType = async (
  db: Firestore,
  user: User,
  schoolId: (null | string) = null
): Promise<string | null> => {

  if (schoolId === null) {
    schoolId = getSchoolId();
  }

  const userRef = doc(db, `schools/${schoolId}/users/${user.uid}`);
  const userDoc = await getDoc(userRef);
  console.log('user doc', userDoc);
  if (userDoc.exists()) {
    console.log('user doc data', userDoc.data());
    if (userDoc.data().type) {
    return userDoc.data().type;
  } else {
    const userCollection = collection(db, `schools/${schoolId}/users`);
    const userQuery = query(userCollection, where('email', '==', user.email));
    const userSnapshot = await getDocs(userQuery);
    userSnapshot.forEach((doc) => {
      if (doc.data().type) {
        return doc.data().type ?? null;
      }
    });
  }
}
  return null;

}

export default getUserType;

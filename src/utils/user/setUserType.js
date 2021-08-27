import { collection, doc, setDoc } from "@firebase/firestore"

const setUserType = async (db, user, type) => {
  const userRef = collection(db, "users")
  await setDoc(doc(userRef, user.uid), {
    name: user.displayName,
    email: user.email,
    type: type
  }).then(() => {
    return
  })
}

export default setUserType
import { doc, getDoc } from "@firebase/firestore"

const getGroups = async (db) => {
  const groupRef = doc(db, "config", "student_groups")
  const groupSnap = await getDoc(groupRef)

  if (groupSnap.exists()) {
    const groupList = groupSnap.data().groups
    if (Array.isArray(groupList)) {
      return groupList
    } else {
      return []
    }
  } else {
    return []
  }
}

export default getGroups
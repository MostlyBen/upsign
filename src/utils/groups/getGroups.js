import { doc, getDoc } from "@firebase/firestore"

  const getGroups = async (db) => {
    const groupRef = doc(db, "config", "student_groups")
    getDoc(groupRef)
      .then(groupSnap => {
        if (groupSnap.exists()) {
          const groupList = groupSnap.data().groups

          if (Array.isArray(groupList)) {
            // setGroupOptions(groupList)
            return groupList
          } else {
            return []
          }
        }
      })
  }

export default getGroups
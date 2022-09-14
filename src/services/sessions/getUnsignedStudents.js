import { collection, query, where, getDocs } from "@firebase/firestore"
import { getAllStudents, getHourEnrollments } from "../"
import { getSchoolId } from "../../utils";

const getUnsignedStudents = async (db, date, hour, groupFilter = 'none') => {
  const schoolId = getSchoolId()
  const hourEnrollments = await getHourEnrollments(db, date, hour)
  let signedIdList = hourEnrollments.map(e => e.uid)
  let unsignedList = []

  // If there are enrollments, find all students who are not in that list
  if (signedIdList.length > 0) {
    // Create query for students not in the hourEnrollments
    const unsignedQuery = query(
      collection(db, "schools", schoolId, "users"),
      // "__name__" refers to the document's name (AKA, its ID)
      where("type", "==", "student"))

    // Get docs fitting the query
    const unsignedSnap = await getDocs(unsignedQuery)
    unsignedSnap.forEach((snap) => {
      // Check if the student is already signed up
      if (!signedIdList.includes(snap.id)) {
        const snapData = snap.data()
        // If no group filter, push the student in
        if (groupFilter === 'none') {
          unsignedList.push({
            uid: snap.id,
            ...snapData
          })
        // If there IS a group filter...
        } else {
          // Make sure the student's doc has a groups property
          if (Array.isArray(snapData.groups)) {
            // Push the student if they're in the group
            if (snapData.groups.includes(groupFilter)) {
              unsignedList.push({
                uid: snap.id,
                ...snapData
              })
            }
          }
        }
      }
    })

  // If no one is signed up, get a list of all students
  } else {
    // Set the unsignedList to a list of all students (if no group filter)
    if (groupFilter === 'none') {
      unsignedList = await getAllStudents(db)
    
    // Find all students and push those in the group, otherwise
    } else {
      var allStudents = await getAllStudents(db)

      for (const i in allStudents) {
        if ( Array.isArray(allStudents[i].groups) ) {
          if (allStudents[i].groups.includes(groupFilter)) {
            unsignedList.push(allStudents[i])
          }
        }
      } // End for loop
    }

  }

  // Sort and return the list
  unsignedList.sort((a, b) => (( a.nickname ?? a.name ) > ( b.nickname ?? b.name )) ? 1 : -1 )
  return unsignedList
  
}

export default getUnsignedStudents
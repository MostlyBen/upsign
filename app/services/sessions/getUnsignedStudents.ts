import { collection, query, where, getDocs, Firestore } from "@firebase/firestore"
import { getAllStudents, getHourEnrollments } from "../"
import { getSchoolId } from "../../utils";
import { UpsignUser } from "~/types";

const getUnsignedStudents = async (
  db: Firestore,
  date: Date,
  hour: number,
  groupFilter?: string,
): Promise<UpsignUser[]> => {

  const schoolId = getSchoolId();
  const hourEnrollments = await getHourEnrollments(db, date, hour);
  const signedIdList = hourEnrollments.map(e => e.uid);
  let unsignedList: UpsignUser[] = [];

  // If there are enrollments, find all students who are not in that list
  if (signedIdList.length > 0) {
    // Create query for students not in the hourEnrollments
    const unsignedQuery = query(
      collection(db, `schools/${schoolId}/users`),
      // "__name__" refers to the document's name (AKA, its ID)
      where("type", "==", "student"));

    // Get docs fitting the query
    const unsignedSnap = await getDocs(unsignedQuery)
    unsignedSnap.forEach((snap) => {
      // Check if the student is already signed up
      if (!signedIdList.includes(snap.id)) {
        const snapData = snap.data() as UpsignUser;
        // If no group filter, push the student in
        if (!groupFilter) {
          unsignedList.push({
            ...snapData,
            uid: snap.id,
          })
          // If there IS a group filter...
        } else {
          // Make sure the student's doc has a groups property
          if (Array.isArray(snapData.groups)) {
            // Push the student if they're in the group
            if (snapData.groups.includes(groupFilter)) {
              unsignedList.push({
                ...snapData,
                uid: snap.id,
              })
            }
          }
        }
      }
    });

    // If no one is signed up, get a list of all students
  } else {
    // Set the unsignedList to a list of all students (if no group filter)
    if (!groupFilter) {
      unsignedList = await getAllStudents(db) as UpsignUser[];

      // Find all students and push those in the group, otherwise
    } else {
      const allStudents = await getAllStudents(db) as UpsignUser[];

      for (const i in allStudents) {
        if (Array.isArray(allStudents[i].groups)) {
          if (allStudents[i].groups?.includes(groupFilter)) {
            unsignedList.push(allStudents[i]);
          }
        }
      } // End for loop
    }

  }

  // Sort and return the list
  unsignedList.sort((a, b) => ((a.nickname ?? a.name) > (b.nickname ?? b.name)) ? 1 : -1);
  return unsignedList;

}

export default getUnsignedStudents;

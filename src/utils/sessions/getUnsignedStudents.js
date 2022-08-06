import { collection, query, where, getDocs } from "@firebase/firestore"
import { schoolId } from "../../config";

const getUnsignedStudents = async (db, date, hour, groupFilter = 'none') => {
  const sessionQuery = query(collection(db, "schools", schoolId, "sessions", String(date.getFullYear()), String(date.toDateString())), where("session", "==", Number(hour))/*, where("capacity", "!=", 0)*/);
  const hourSessions = await getDocs(sessionQuery)
    .then(querySnapshot => {
      const s = []
      querySnapshot.forEach((doc) => {
        if (doc.data().title) {
          s.push({
            uid: doc.id,
            ...doc.data()
          })
        }
      });

      return s
    })


  const studentQuery = query(collection(db, "schools", schoolId, "users"), where("type", "==", "student"));
  const allStudents = await getDocs(studentQuery)
    .then(querySnapshot => {
      const s = []
      querySnapshot.forEach((doc) => {
        if (doc.data()) {
          s.push({
            uid: doc.id,
            name: doc.data().name,
            groups: doc.data().groups,
            nickname: doc.data().nickname,
          })
        }
      });

      return s
    });


  const unsignedStudents = []
  
  // For each student, look through all sessions and see if their ID is in any enrollment
  allStudents.forEach(student => {
    let signed = false;
    for (const i in hourSessions) {
      const enrollment = hourSessions[i].enrollment

      if (Array.isArray(enrollment)) {
        for (const j in enrollment) {
          
          if (String(hourSessions[i].enrollment[j].uid) === String(student.uid)) {
            signed = true;
          }
        }
      }
    }

    if (!signed) {
      if (groupFilter === 'none') {
        unsignedStudents.push(student)
      } else {
        if (Array.isArray(student.groups)) {
          if (student.groups.includes(groupFilter)) {
            unsignedStudents.push(student)
          }
        }
      }
    }
  });

  unsignedStudents.sort((a, b) => (( a.nickname ?? a.name ) > ( b.nickname ?? b.name )) ? 1 : -1 )
  return unsignedStudents
}

export default getUnsignedStudents
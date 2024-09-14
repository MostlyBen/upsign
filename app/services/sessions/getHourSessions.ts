import { collection, query, where, getDocs, Firestore } from "@firebase/firestore"
import { getSchoolId } from "../../utils";

interface Session {
  title?: string;
  number_enrolled: number;
  [key: string]: any;
}

const getHourSessions = async (db: Firestore, date: Date, hour: number, schoolId: string | null = null): Promise<Session[]> => {
  if (schoolId === null) {
    schoolId = getSchoolId()
  }
  
  // Query and get the session docs
  const q = query(
              collection(db, `schools/${schoolId}/sessions/${date.getFullYear()}/${date.toDateString()}`),
              where("session", "==", hour));
  const sessionsSnap = await getDocs(q)

  // Assemble an array to return
  const s: Session[] = []
  sessionsSnap.forEach(doc => {
    const docData = doc.data() as Session;
    // Make sure the session has a title
    if (docData.title) {
      s.push(docData)
    // Still show if students are signed up
    } else if (docData.number_enrolled > 0) {
      docData.title = "No Title"
      s.push(docData)
    }
  })

  return s
}

export default getHourSessions
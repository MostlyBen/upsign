import { collection, query, where, getDocs, Firestore } from "@firebase/firestore";
import { getSchoolId } from "../../utils";
import { UpsignUser } from "~/types";


const getAllStudents = async (
  db: Firestore,
  asDictionary = false
): Promise<UpsignUser[] | Record<string, UpsignUser>> => {

  const schoolId = getSchoolId();
  const studentQuery = query(collection(db, `schools/${schoolId}/users`), where("type", "==", "student"));
  const allStudents = await getDocs(studentQuery)
    .then(querySnapshot => {
      if (!asDictionary) {
        const s: UpsignUser[] = [];
        querySnapshot.forEach((doc) => {
          if (doc.data()) {
            s.push({
              uid: doc.id,
              ...doc.data(),
            } as UpsignUser);
          }
        });

        return s;
      } else {
        const s: Record<string, UpsignUser> = {};
        querySnapshot.forEach((doc) => {
          if (doc.data()) {
            s[doc.id] = doc.data() as UpsignUser;
          }
        });

        return s;
      }
    });

  return allStudents;
};

export default getAllStudents;


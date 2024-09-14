import { collection, query, where, getDocs, Firestore } from "@firebase/firestore";
import { getSchoolId } from "../../utils";

interface Teacher {
  uid: string;
  [key: string]: any;
}

const getAllTeachers = async (db: Firestore, asDictionary = false): Promise<Teacher[] | Record<string, Teacher>> => {
  const schoolId = getSchoolId();
  const teacherQuery = query(collection(db, `schools/${schoolId}/users`), where("type", "==", "teacher"));
  const allTeachers = await getDocs(teacherQuery)
    .then(querySnapshot => {
      if (!asDictionary) {
        const t: Teacher[] = [];
        querySnapshot.forEach((doc) => {
          if (doc.data()) {
            t.push({
              uid: doc.id,
              ...doc.data(),
            });
          }
        });

        return t;
      } else {
        const t: Record<string, Teacher> = {};
        querySnapshot.forEach((doc) => {
          if (doc.data()) {
            t[doc.id] = doc.data() as Teacher;
          }
        });

        return t;
      }
    });

  return allTeachers;
};

export default getAllTeachers;


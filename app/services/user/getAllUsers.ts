import { collection, query, where, getDocs, Firestore } from "@firebase/firestore";
import { getSchoolId } from "../../utils";
import { UpsignUser } from "~/types";

const getAllUsers = async (db: Firestore, asDictionary = false): Promise<UpsignUser[] | Record<string, UpsignUser>> => {
  const schoolId = getSchoolId();
  const userQuery = collection(db, `schools/${schoolId}/users`);
  const allUsers = await getDocs(userQuery)
    .then(querySnapshot => {
      if (!asDictionary) {
        const t: UpsignUser[] = [];
        querySnapshot.forEach((doc) => {
          if (doc.data()) {
            t.push({
              uid: doc.id,
              ...doc.data(),
            } as UpsignUser);
          }
        });

        return t;
      } else {
        const t: Record<string, UpsignUser> = {};
        querySnapshot.forEach((doc) => {
          if (doc.data()) {
            t[doc.id] = doc.data() as UpsignUser;
          }
        });

        return t;
      }
    });

  return allUsers;
};

export default getAllUsers;


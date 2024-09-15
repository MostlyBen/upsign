import { doc, updateDoc, setDoc, getDoc, Firestore } from "@firebase/firestore";
import { User } from "firebase/auth";
import { UpsignUser } from "~/types";
import { getSchoolId } from "../../utils";

const setUserType = async (
  db: Firestore,
  user: User,
  userType: "student" | "teacher",
  schoolId: string | null = null
): Promise<void> => {
  if (schoolId === null) {
    schoolId = getSchoolId();
  }

  const userRef = doc(db, `schools/${schoolId}/users/${user.uid}`);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const res = await updateDoc(userRef, { type: userType });
    return res;
  } else {
    if (!user.email) { throw new Error("Cannot register a user without an email") }
    const res = setDoc(userRef, {
      type: userType,
      email: user.email,
      name: user.displayName ?? user.email,
      groups: [],
    } as UpsignUser);
    return res;
  }
};

export default setUserType;

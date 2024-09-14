import { doc, updateDoc, Firestore, deleteField } from "@firebase/firestore";
import { getSchoolId } from "../../utils";

interface UserData {
  [key: string]: any;
}

const setUser = async (
  db: Firestore,
  uid: string,
  payload: UserData | string,
  schoolId: string | null = null,
  shouldDeleteField: boolean = false
): Promise<void> => {
  if (schoolId === null) {
    schoolId = getSchoolId();
  }

  if (shouldDeleteField && typeof payload !== "string") {
    throw new Error("Tried to delete field but did not receive a string as payload");
  }

  const _payload: UserData = typeof payload === 'string' ? {} : payload;

  const userRef = doc(db, `schools/${schoolId}/users/${uid}`);

  if (shouldDeleteField && typeof payload === "string") {
    _payload[payload] = deleteField();
  }

  const res = await updateDoc(userRef, _payload);
  return res;
};

export default setUser;


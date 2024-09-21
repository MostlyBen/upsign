import { useState, useEffect } from "react";
import { Firestore, doc, onSnapshot } from "firebase/firestore";
import { User, getAuth } from "firebase/auth";
import { getSchoolId } from "~/utils";

import {
  setUserType,
  allowStudentRegister
} from "~/services";

type NewUserProps = {
  db: Firestore,
  user: User,
}

const NewUser = ({ db, user }: NewUserProps) => {
  const [teacherAllowed, setTeacherAllowed] = useState<boolean>(false);
  const schoolId = getSchoolId();

  useEffect(() => {
    const teacherRegRef = doc(db, `schools/${schoolId}/config/teacher_register`);
    const unsubscribe = onSnapshot(teacherRegRef, (doc) => {
      const active = doc.data()?.active;
      if (typeof active === "boolean") {
        setTeacherAllowed(active);
      }
    });

    return () => unsubscribe();
  }, [db]);

  const setType = async (userType: "student" | "teacher") => {
    if (!user.email) { throw new Error("Tried to register a user without an email") }

    const allow = await allowStudentRegister(db, user.email);
    if (allow) {
      await setUserType(db, user, userType).then(() => { window.location.reload() });
    } else {
      getAuth().signOut();
      window.alert(`Cannot register with that email`);
      window.location.reload();
    }
  }

  return (
    <div className="prose pt-32 w-screen" style={{ height: "100dvh" }}>
      <h1 className="w-screen text-center">What&apos;s your role at the school?</h1>
      <div className="w-screen">
        <div className="flex flex-row content-between justify-between mx-12 md:mx-24 lg:mx-48 gap-8">
          <button
            className="btn btn-primary grow"
            onClick={() => setType("student")}
          >
            Student
          </button>
          <button
            className="btn btn-primary grow"
            disabled={!teacherAllowed}
            onClick={() => setType("teacher")}
          >
            Teacher
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewUser;


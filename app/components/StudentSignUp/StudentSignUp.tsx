import { useState, useEffect } from "react";
import { onSnapshot, doc, query, where, collection, Firestore } from "@firebase/firestore"
import ProgressBar from './ProgressBar'

import {
  getNumberSessions,
  getDefaultDay,
  getSessionTimes,
  getSignupAllowed,
  getStudentEnrollments,
  getUser,
  getSessionTitles,
} from "../../services";
import {
  getDateString,
  observeTopIntersect,
  getSchoolId,
} from "../../utils";

import SessionSelector from './SessionSelector'
import { Enrollment, UpsignUser } from "~/types";
import StudentTopMessage from "./StudentTopMessage";


type StudentSignupProps = {
  db: Firestore,
  user: UpsignUser,
}

const StudentSignUp = ({ db, user }: StudentSignupProps) => {
  const [sessionArray, setSessionArray] = useState<number[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [numberSessions, setNumberSessions] = useState<number>(1);
  const [sessionTimes, setSessionTimes] = useState<string[] | null>([]);
  const [sessionTitles, setSessionTitles] = useState<string[] | null>();
  const [signupAllowed, setSignupAllowed] = useState<boolean>(false);
  const [userDoc, setUserDoc] = useState<UpsignUser | null>();
  const [userEnrollments, setUserEnrollments] = useState<Enrollment[]>([]);

  const schoolId = getSchoolId();

  const updateNumberSessions = async (db: Firestore, selectedDate: Date) => {
    const newNumber = await getNumberSessions(db, selectedDate)
    setNumberSessions(newNumber)
  }

  const updateSessionTimes = async (db: Firestore, selectedDate: Date) => {
    const newTimes = await getSessionTimes(db, selectedDate)
    setSessionTimes(newTimes)
  }

  const updateSessionTitles = async (db: Firestore, selectedDate: Date) => {
    const newTitles = await getSessionTitles(db, selectedDate);
    setSessionTitles(newTitles as string[]);
  }

  const updateSignupAllowed = async () => {
    const allowed = await getSignupAllowed(db, null, selectedDate);
    setSignupAllowed(allowed);
  }

  const refreshUserDoc = async () => {
    if (!user.uid) { return }

    const res = await getUser(db, user.uid);
    setUserDoc({
      uid: user.uid,
      ...res
    } as UpsignUser);
  }

  // Select default day
  const updateDefaultDay = async (db: Firestore) => {
    const defaultDay = await getDefaultDay(db);
    setSelectedDate(defaultDay as Date);
  }

  // Get the user's enrollments
  const updateUserEnrollments = async (db: Firestore, date: Date) => {
    if (!user.uid) { return }
    const enr = await getStudentEnrollments(db, date, user.uid);

    setUserEnrollments(enr);
  }

  /* Initial Load */
  useEffect(() => {
    updateDefaultDay(db)

    // Initialize the observer
    // Checks when the DatePicker (".sticky-container") intersects with the navbar
    observeTopIntersect()

    // Initially loads the user & whether or not they can sign up
    updateSignupAllowed()
    refreshUserDoc()

    const signupAllowedRef = doc(db, `schools/${schoolId}/config/student_signup`)
    const unsubscribe = onSnapshot(signupAllowedRef, (doc) => {
      const active = doc.data()?.active;
      if (typeof active === "boolean") {
        setSignupAllowed(active);
      }
    })

    return () => unsubscribe();
  }, []);

  // Subscribe to user doc changes
  useEffect(() => {
    const userDocRef = doc(db, `schools/${schoolId}/users/${user.uid}`)
    const unsubscribe = onSnapshot(userDocRef, () => {
      refreshUserDoc();
    })

    return () => unsubscribe();
  }, [db]);

  // Subscribe to changes in user's enrollments
  useEffect(() => {
    const enrQuery = query(
      collection(
        db,
        `schools/${schoolId}/sessions/${selectedDate.getFullYear()}/${selectedDate.toDateString()}-enrollments`
      ),
      where("uid", "==", user.uid)
    );

    const unsubscribe = onSnapshot(enrQuery, () => {
      updateUserEnrollments(db, selectedDate);
    });

    updateSignupAllowed();

    return () => unsubscribe();
  }, [db, selectedDate]);

  // Update the number & times of sessions if the selected date changes
  useEffect(() => {
    // Set up snapshot & load the times of the sessions
    const d = doc(db, `schools/${schoolId ?? "museum"}/config/sessions`)
    const unsubscribe = onSnapshot(d, () => {
      updateSessionTimes(db, selectedDate);
      updateSessionTitles(db, selectedDate);
      updateNumberSessions(db, selectedDate);
    });

    return () => unsubscribe();
  }, [db, selectedDate]);

  // Update the number of hours to render when the number of sessions changes
  useEffect(() => {
    const newArr = []
    for (let i = 0; i < numberSessions; i++) {
      newArr.push(i);
    }
    setSessionArray(newArr);

  }, [numberSessions]);


  return (
    <div>
      <StudentTopMessage user={userDoc?.nickname ? { nickname: userDoc.nickname, ...user } : user} />
      <input
        className="input w-full p-4 bg-base-100 print:hidden"
        style={{ minWidth: "100%" }}
        type="date"
        value={selectedDate
          ? getDateString(selectedDate)
          : ''}
        onChange={(e) => {
          setSelectedDate(new Date(`${e.target.value}T00:00:00`));
        }}
      />

      {userDoc && sessionArray.map((index) => <SessionSelector
        key={`session-${index}`}
        hour={index + 1}
        userDoc={userDoc}
        db={db}
        selectedDate={selectedDate}
        sessionTime={Array.isArray(sessionTimes) ? sessionTimes[index] : null}
        sessionTitle={Array.isArray(sessionTitles) ? sessionTitles[index] : null}
        signupAllowed={signupAllowed}
        schoolId={schoolId as string}
        userEnrollments={userEnrollments}
      />)}

      <ProgressBar percent={userEnrollments.length > 0
        ? (userEnrollments.length / numberSessions)
        : 0}
      />

    </div>
  )

}

export default StudentSignUp

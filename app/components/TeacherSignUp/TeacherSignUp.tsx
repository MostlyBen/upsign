// TODO: Update session gettings to use useFirebaseQuery
import { Session, UpsignUser } from "~/types";
import { useState, useEffect } from "react";
import { Firestore, collection, query, where, onSnapshot, doc } from "@firebase/firestore"

import TopMessage from "./TeacherTopMessage";
import HourSessions from "./HourSessions";
import TeacherSelect from "./TeacherSelect";

import {
  getSessionTimes,
  getNumberSessions,
  getTeacherSessions,
  getSessionTitles,
  getDefaultDay,
} from "../../services";

import {
  getDateString,
  getSchoolId,
  observeTopIntersect,
} from "../../utils";

type TeacherSignUpProps = {
  db: Firestore,
  user: UpsignUser,
  groupOptions: string[]
}

// Clunky, but it gets the job done
const renderHours = (
  db: Firestore,
  selectedDate: Date | null,
  numberSessions: number,
  sessionTimes: string[],
  sessionTitles: string[] | null | undefined,
  sessions: { [key: string]: Session[] },
  user: UpsignUser,
  groupOptions: string[],
  hideAdd?: boolean,
) => {
  const hourArr = []
  for (let i = 1; i < numberSessions + 1; i++) {
    hourArr.push(i)
  }

  if (!selectedDate) { return <></> };

  return (<>
    {hourArr.map(hour => {
      return (
        <HourSessions
          db={db}
          selectedDate={selectedDate}
          hour={hour}
          key={`hour-${hour}`}
          sessionTimes={sessionTimes}
          sessionTitles={sessionTitles}
          sessions={sessions[String(hour)]}
          user={user}
          groupOptions={groupOptions}
          hideAdd={hideAdd}
        />
      )
    })}
  </>)
}

const TeacherSignUp = ({ db, user, groupOptions }: TeacherSignUpProps) => {
  const [sessions, setSessions] = useState<null | { [key: string]: Session[] }>();
  const [numberSessions, setNumberSessions] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>();
  const [sessionTimes, setSessionTimes] = useState<string[]>([]);
  const [sessionTitles, setSessionTitles] = useState<string[] | null>();
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);

  const schoolId = getSchoolId()

  const updateSessionTimes = async () => {
    const newTimes = await getSessionTimes(db, selectedDate)
    setSessionTimes(newTimes as string[])
  }

  const updateNumberSessions = async () => {
    const newNumber = await getNumberSessions(db, selectedDate)
    setNumberSessions(newNumber)
  }

  const updateSessionTitles = async () => {
    const newTitles = await getSessionTitles(db, selectedDate)
    setSessionTitles(newTitles as string[] | null)
  }

  // Initialize the observer
  // Checks when the DatePicker (".sticky-container") intersects with the navbar
  useEffect(() => {
    observeTopIntersect()
  }, [sessions]);

  // Subscribe to updates for session number and times
  useEffect(() => {
    if (selectedDate) {
      // Set up snapshot & load the times of the sessions
      const d = doc(db, `schools/${schoolId}/config/sessions`);
      const unsubscribe = onSnapshot(d, () => {
        updateSessionTimes();
        updateNumberSessions();
        updateSessionTitles();
      })

      return () => unsubscribe();
    }
  }, [db, selectedDate]);

  const handleSelectDate = (date: Date) => {
    setSessions(null);
    setSelectedDate(date);
  }

  // Select default day
  const updateDefaultDay = async (db: Firestore) => {
    const defaultDay = await getDefaultDay(db);
    setSelectedDate(defaultDay as Date);
  }

  useEffect(() => {
    if (!selectedDate) {
      updateDefaultDay(db);
    }
  }, [db, selectedDate]);

  useEffect(() => {
    if (selectedDate) {
      const q = query(collection(
        db,
        `schools/${schoolId}/sessions/${String(selectedDate.getFullYear())}/${String(selectedDate.toDateString())}`),
        where("teacher_id", "==", user.uid));
      const unsubscribe = onSnapshot(q, async () => {
        await getTeacherSessions(db, selectedDate, selectedTeacher ?? user)
          .then(s => {
            setSessions(s)
          })
      });

      return () => unsubscribe()
    }
  }, [db, selectedDate, numberSessions, selectedTeacher]);

  return (
    <div className="signup-body">
      {localStorage.getItem("show-other-schedule") === "true" &&
        <TeacherSelect db={db} onSelect={(t: string | null) => setSelectedTeacher(t)} />
      }
      {!selectedTeacher && <TopMessage user={user} />}

      <input
        className="input w-full p-4 bg-base-100 print:hidden"
        style={{ minWidth: "100%" }}
        type="date"
        value={selectedDate
          ? getDateString(selectedDate)
          : ''}
        onChange={(e) => {
          if (isNaN(Date.parse(e.target.value))) { return }
          handleSelectDate(new Date(`${e.target.value}T00:00:00`));
        }}
      />

      {sessions
        ? <div className="teacher-sessions">
          {renderHours(
            db,
            selectedDate as Date,
            numberSessions,
            sessionTimes,
            sessionTitles,
            sessions,
            user,
            groupOptions,
            selectedTeacher !== null,
          )}
        </div>
        : <div>Loading...</div>}
    </div>
  )
}

export default TeacherSignUp;


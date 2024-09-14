import { Session } from "~/types";
import { User } from "firebase/auth";
import { useState, useEffect } from "react";
import { Firestore, collection, query, where, onSnapshot, doc } from "@firebase/firestore"

import TopMessage from "./TeacherTopMessage";
import HourSessions from "./HourSessions";

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
  user: User,
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
  user: User,
  groupOptions: string[]
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
  }, [sessions])

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


  const handleLoadSessions = async () => {
    if (!selectedDate) { return }
    setSessions(null);
    await getTeacherSessions(db, selectedDate, user)
      .then(s => {
        setSessions(s);
      })
  }

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
    } else {
      // Load teacher sessions
      handleLoadSessions();
    }
  }, [db, selectedDate]);

  useEffect(() => {
    if (selectedDate) {
      const q = query(collection(
        db,
        `schools/${schoolId}/sessions/${String(selectedDate.getFullYear())}/${String(selectedDate.toDateString())}`),
        where("teacher", "==", user.displayName));
      const unsubscribe = onSnapshot(q, async () => {
        await getTeacherSessions(db, selectedDate, user)
          .then(s => {
            setSessions(s)
          }
          )
      })

      return () => unsubscribe()
    }
  }, [db, selectedDate, numberSessions])

  return (
    <div className="signup-body">
      <TopMessage user={user} />
      <input
        className="w-full mx-auto p-2 bg-base-100"
        style={{ minWidth: "100%" }}
        type="date"
        value={selectedDate
          ? getDateString(selectedDate)
          : ''}
        onChange={(e) => {
          handleSelectDate(new Date(`${e.target.value}T00:00:00`));
        }}
      />

      {sessions
        ? <div className="teacher-sessions">
          {renderHours(db, selectedDate as Date, numberSessions, sessionTimes, sessionTitles, sessions, user, groupOptions)}
        </div>
        : <div>Loading...</div>}
    </div>
  )
}

export default TeacherSignUp

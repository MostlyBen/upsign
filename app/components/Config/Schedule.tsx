import { Firestore } from "firebase/firestore";
import { useState, useEffect } from "react";
import { Add, Minus } from "~/icons";
import {
  getNumberSessions,
  setNumberSessions,
  getSessionTimes,
  setSessionTimes,
} from "~/services"
import { numberToArrayOfStrings } from '~/utils';

type ConfigRowProps = {
  number: number,
  time: string,
  handleChange: (arg0: number, arg1: string) => void,
}

const SessionsConfigRow = ({ number, time, handleChange }: ConfigRowProps) => {

  return (
    <tr>
      <td className="flex justify-center"><b>{number}</b></td>
      <td className="table-input">
        <div className="input-field table-input">
          <input
            className="input input-bordered input-md w-full"
            id={`session-${number}-time`}
            defaultValue={time}
            type="text"
            autoComplete="off"
            onChange={(e) => handleChange(Number(number), e.target.value)}
          />
        </div>
      </td>
    </tr>
  )
}

type ScheduleConfigProps = {
  db: Firestore,
}

const ScheduleConfig = ({ db }: ScheduleConfigProps) => {
  const [numberSessionState, setNumberSessionState] = useState<number>(1);
  const [sessionTimesState, setSessionTimesState] = useState<string[]>([]);
  const [sessionsArray, setSessionsArray] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const updateConfig = async (db: Firestore) => {
    setLoading(true);
    const numberSessionsSetting = await getNumberSessions(db);
    const sessionTimesSetting = await getSessionTimes(db);
    setNumberSessionState(numberSessionsSetting);
    setSessionTimesState(sessionTimesSetting);
    setLoading(false);
  }

  useEffect(() => {
    updateConfig(db);
  }, [db]);

  useEffect(() => {
    const newArr = numberToArrayOfStrings(numberSessionState);
    setSessionsArray(newArr);
  }, [numberSessionState]);

  const handleChangeSessions = async (change: "add" | "remove") => {
    if (change === "add") {
      setNumberSessions(db, numberSessionState + 1)
      setNumberSessionState(numberSessionState + 1)

    } else if (change === "remove") {
      if (numberSessionState > 1) {
        setNumberSessions(db, numberSessionState - 1)
        setNumberSessionState(numberSessionState - 1)
      }
    }
  }

  const handleChangeTime = async (session: number, time: string) => {
    const n = session - 1
    const timesCopy = sessionTimesState
    // Make sure the Array is long enough to contain the index
    if (timesCopy[n]) {
      timesCopy[n] = time
      setSessionTimes(db, timesCopy)
      setSessionTimesState(timesCopy)
    } else {
      for (let i = 0; i < n; i++) {
        timesCopy[i] = timesCopy[i] ?? ""
      }
      timesCopy[n] = time
      setSessionTimes(db, timesCopy)
      setSessionTimesState(timesCopy)
    }

  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="prose">
      <h1>
        Configure Schedule
      </h1>

      <hr className="my-4" />

      <h2 className="mb-2">Number of Sessions</h2>
      <div className="join">
        <button
          className="btn join-item"
          onClick={() => handleChangeSessions("remove")}
        >
          <Minus />
        </button>
        <span
          className="join-item px-6 text-2xl"
          style={{
            position: "relative",
            lineHeight: 2,
          }}
        >
          {numberSessionState}
        </span>
        <button
          className="btn join-item"
          onClick={() => handleChangeSessions("add")}
        >
          <Add />
        </button>

      </div>

      <h2 className="mt-6">Session Times</h2>
      <div>
        <table className="centered highlight">
          <thead>
            <tr>
              <th>Session</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {sessionsArray.map(s => (
              <SessionsConfigRow
                number={Number(s)}
                time={sessionTimesState[Number(s) - 1]}
                handleChange={handleChangeTime}
                key={`table-row-session-${s}`}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ScheduleConfig


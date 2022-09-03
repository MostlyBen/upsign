import { useState, useEffect } from "react";
import {
  getNumberSessions,
  setNumberSessions,
  getSessionTimes,
  setSessionTimes,
} from "../../../services"
import { numberToArrayOfStrings } from '../../../utils';
import { LoadingBar } from "../.."

const SessionsConfigRow = ({ number, time, handleChange }) => {

  return (
    <tr>
      <td>{number}</td>
      <td className="table-input">
        <div className="input-field table-input">
          <input
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

const ScheduleConfig = ({ db }) => {
  const [ numberSessionState, setNumberSessionState ] = useState(1)
  const [ sessionTimesState, setSessionTimesState ] = useState([])
  const [ sessionsArray, setSessionsArray ] = useState([])
  const [ loading, setLoading ] = useState( true )

  const updateConfig = async (db) => {
    setLoading(true)
    const numberSessionsSetting = await getNumberSessions(db)
    const sessionTimesSetting = await getSessionTimes(db)
    setNumberSessionState(numberSessionsSetting)
    setSessionTimesState(sessionTimesSetting)
    setLoading(false)
  }

  useEffect(() => {
    updateConfig(db)
  }, [db])

  useEffect(() => {
    const newArr = numberToArrayOfStrings(numberSessionState)
    setSessionsArray(newArr)
  }, [numberSessionState])

  const handleChangeSessions = async (change) => {
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

  const handleChangeTime = async (session, time) => {
    const n = Number(session) - 1
    let timesCopy = sessionTimesState
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
    return <LoadingBar />
  }

  return (
    <div className="menu-card">
      <h1>
        Configure Sessions
      </h1>

      <hr style={{margin: "2rem 0"}} />

      <h2>Number of Sessions</h2>
      <div>
        <a
          href="#!"
          className="btn-floating btn-large waves-effect waves-light teal lighten-1"
          style={{transform: "scale(0.6)"}}
          onClick={() => handleChangeSessions("remove")}
        >
          <i className="material-icons">
            remove
          </i>
        </a>
        <span
          style={{
            fontSize: "2rem",
            position: "relative",
            top: "0.5rem",
            margin: "0 1rem",
          }}
        >
          {numberSessionState}
        </span>
        <a
          href="#!"
          className="btn-floating btn-large waves-effect waves-light teal lighten-1"
          style={{transform: "scale(0.6)"}}
          onClick={() => handleChangeSessions("add")}
        >
          <i className="material-icons">
            add
          </i>
        </a>

      </div>

      <hr style={{margin: "2rem 0"}} />

      <h2>Session Times</h2>
      <div>
        <table className="responsive-table">
          <thead>
            <tr>
              <th>Session</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            { sessionsArray.map(s => (
            <SessionsConfigRow
              number={Number(s)}
              time={sessionTimesState[Number(s)-1]}
              handleChange={handleChangeTime}
            />
            )) }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ScheduleConfig
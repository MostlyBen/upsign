import { useState, useEffect } from "react"
import {
  getSignupAllowed,
  setSignupAllowed,
  getDefaultDay,
  setDefaultDay,
  getSchoolName,
  setSchoolName,
} from '../../../services'
import { LoadingBar, MenuDiv } from "../../";

import M from "materialize-css";

const General = ({ db }) => {
  const [loading, setLoading] = useState(true)
  const [studentSign, setStudentSign] = useState(true)
  const [defaultDayState, setDefaultDayState] = useState('')
  const [schoolNameState, setSchoolNameState] = useState('')
  const [nameMatch, setNameMatch] = useState(true)
  // const [teacherEdit, setTeacherEdit] = useState(true)

  const updateSettings = async () => {
    const studentSignupSetting = await getSignupAllowed(db)
    const defaultDaySetting = await getDefaultDay(db, null, true)
    const schoolNameSetting = await getSchoolName(db)

    setStudentSign(studentSignupSetting)
    setDefaultDayState(defaultDaySetting)
    setSchoolNameState(schoolNameSetting)
    setLoading(false)
  }

  useEffect(() => {
    updateSettings()
    M.AutoInit()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    updateDropdown()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultDayState])

  const updateDropdown = () => {
    var elem = document.getElementById("default-day-select")
    if (elem !== null) {
        for (var option of elem.options) {
          if (option.value === defaultDayState) {
            option.selected = true
            return
          }
        }
    } else {
      setTimeout(updateDropdown, 15)
    }
  }

  const checkNameMatch = (e) => {
    setNameMatch(e.target.value === schoolNameState)
  }

  const handleSwitchStudentSign = async () => {
    await setSignupAllowed(db, {active: !studentSign});
    setStudentSign(!studentSign);
  }

  const handleCancelNameInput = () => {
    var elem = document.getElementById("school-name-input")
    elem.value = schoolNameState
    setNameMatch(true)
  }

  const handleSaveNameInput = () => {
    var elem = document.getElementById("school-name-input")
    setSchoolName(db, elem.value)
    setSchoolNameState(elem.value)
    setNameMatch(true)
  }

  const handleChangeDefaultDay = async (e) => {
    var elem = document.getElementById("default-day-select")
    var value = elem.value
    setDefaultDay(db, value)
    setDefaultDayState(value)
  }

  if (loading) {
    return <LoadingBar />
  }

  return (
    <div className="menu-card">
      <h1>
        General Settings
      </h1>

      {loading
        ? <LoadingBar />
        : <div />
      }

      <MenuDiv />

      {/* Student SignUps */}
      <h2>Student Sign Ups</h2>
      <div className="switches">
        <div className="switch toggle-switch">
          <label>
            <input type="checkbox" checked={!!studentSign} readOnly={true} onClick={handleSwitchStudentSign} />
            <span className="lever"></span>
          </label>
          Students can sign up
        </div>
      </div>

      <MenuDiv />

      {/* School Name */}
      <div>
        <h2>School Name</h2>
        <div className="input-field">
          <input
            id={`school-name-input`}
            defaultValue={schoolNameState}
            type="text"
            autoComplete="off"
            onChange={(e) => checkNameMatch(e)}
          />
        </div>
        <div style={{float: "right"}}>
          <div
            className =
              {`waves-effect waves-light btn white grey-text text-darken-2 ${nameMatch ? 'disabled' : ''}`}
            onClick={handleCancelNameInput}
          >
            Cancel
          </div>
          <div style={{ display: 'inline-block', width: '1rem'}} />
          <div
            className =
              {`waves-effect waves-light btn teal lighten-1 ${nameMatch ? 'disabled' : ''}`}
            onClick = {handleSaveNameInput}
          >
            Save
          </div>
        </div>
        <div style={{height: '1.5rem'}} />
      </div>

      <MenuDiv />

      {/* Default Day */}
      <div>
        <h2>Default Day</h2>
        <div className="input-field col s12" style={{marginTop: "10px"}}>
          <select className="browser-default" id="default-day-select" onChange={handleChangeDefaultDay}>
            <option value="" disabled>Select Day</option>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            {/* Makeshift Divider */}
            <option value="" style={{fontSize: "3pt", backgroundColor: "#fff"}} disabled>&nbsp;</option>
            <option value="" style={{fontSize: "1pt", backgroundColor: "dimgrey"}} disabled>&nbsp;</option>
            <option value="" style={{fontSize: "3pt", backgroundColor: "#fff"}} disabled>&nbsp;</option>

            <option value="sunday">Sunday</option>
            <option value="monday">Monday</option>
            <option value="tuesday">Tuesday</option>
            <option value="wednesday">Wednesday</option>
            <option value="thursday">Thursday</option>
            <option value="friday">Friday</option>
            <option value="saturday">Saturday</option>
          </select>
        </div>
      </div>

      <div style={{height: "3rem"}} />

    </div>
  )
}

export default General
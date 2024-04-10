import { useState, useEffect } from "react"
import { Emoji } from 'emoji-picker-react'
import {
  getSignupAllowed,
  setSignupAllowed,
  getDefaultDay,
  setDefaultDay,
  getDefaultReactions,
  setDefaultReactions,
  getSchoolName,
  setSchoolName,
} from '../../../services'
import { LoadingBar, MenuDiv, EmojiSelect } from "../../";

import M from "materialize-css";

const ReactionButton = ({ reaction, onRemove }) => {
  const [hovering, setHovering] = useState(false)

  return (
    <div
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
      style={{ display: 'inline-block', margin: '0 6px', position: 'relative' }}
    >
      <Emoji key={reaction} unified={reaction} size="24" />
      <button
        className="remove-btn-styling"
        style={{ position: 'absolute', right: '-8px', top: '-8px', opacity: hovering ? 1 : 0}}
        onClick={() => onRemove(reaction)}
      ><span className="material-icons">close</span></button>
    </div>
  )
}

const General = ({ db }) => {
  const [loading, setLoading] = useState(true)
  const [studentSign, setStudentSign] = useState(true)
  const [defaultDayState, setDefaultDayState] = useState('')
  const [schoolNameState, setSchoolNameState] = useState('')
  const [defaultReactions, setDefaultReactionsState] = useState([])
  const [reactionsOpen, setReactionsOpen] = useState(false)
  const [nameMatch, setNameMatch] = useState(true)

  const updateSettings = async () => {
    const studentSignupSetting = await getSignupAllowed(db)
    const defaultDaySetting = await getDefaultDay(db, null, true)
    const schoolNameSetting = await getSchoolName(db)
    const _defaultReactions = await getDefaultReactions(db)

    setStudentSign(studentSignupSetting)
    setDefaultDayState(defaultDaySetting)
    setSchoolNameState(schoolNameSetting)
    setDefaultReactionsState(_defaultReactions)
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
    if (defaultDayState) {
      var elem = document.getElementById("default-day-select")
      if (elem !== null) {
        elem.value = defaultDayState
      } else {
        setTimeout(updateDropdown, 15)
      }
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

  const handleAddReaction = async (reaction) => {
    const newReactions = [...defaultReactions, reaction]
    console.log("New reactions:", newReactions)
    setDefaultReactionsState(newReactions)
    await setDefaultReactions(db, newReactions)
  }

  const handleRemoveReaction = async (reaction) => {
    const newReactions = defaultReactions.filter(r => r !== reaction)
    console.log("New reactions:", newReactions)
    setDefaultReactionsState(newReactions)
    await setDefaultReactions(db, newReactions)
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
            {/* <option value="" style={{fontSize: "3pt", backgroundColor: "#fff"}} disabled>&nbsp;</option> */}
            <option value="" style={{fontSize: "1pt", backgroundColor: "dimgrey"}} disabled>&nbsp;</option>
            {/* <option value="" style={{fontSize: "3pt", backgroundColor: "#fff"}} disabled>&nbsp;</option> */}

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

      {/* Reactions */}
      <div>
        <h2>Reactions</h2>
        <div>
          {Array.isArray(defaultReactions) && 
          defaultReactions.map((reaction, i) =>
            <ReactionButton
              key={i}
              reaction={reaction}
              onRemove={handleRemoveReaction}
            />
          )}

          <button
            className="remove-btn-styling"
            onClick={() => setReactionsOpen(o => !o)}
            style={{ margin: '0 0 0 6px' }}
          >
            <span className="material-icons">{reactionsOpen ? 'close' : 'add'}</span>
          </button>
        </div>
        
        <EmojiSelect reactionsOpen={false} open={reactionsOpen} onSubmit={handleAddReaction} />
      </div>

      <div style={{height: "3rem"}} />

    </div>
  )
}

export default General
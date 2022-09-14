import { useEffect, useState } from "react"

import {
  getGroupOptions,
  setGroupOptions,
} from "../../../services"

const GroupEditRow = ({ group, index }) => {

  return (
    <tr>
      <div className="input-field" style={{margin: "0 0 0 1rem"}}>
        <input
          placeholder="Group Name"
          id={`group-option-${index}`}
          type="text"
          className="disabled"
          autoComplete="off"
          value={group}
          style={{
            borderBottom: "none",
            marginTop: "0.75rem"
          }}
        />
      </div>
      <td>

        <a
          className="btn-floating btn-large waves-effect waves-light white grey-text text-darken-2"
          style={{height: "2.5rem", width: "2.5rem"}}
          href="#!"
        >
          <span className="material-icons" style={{position: "relative", top:"-2px"}}>
            arrow_downward
          </span>
        </a>

        <a
          className="btn-floating btn-large waves-effect waves-light white red-text text-lighten-1"
          style={{height: "2.5rem", width: "2.5rem", margin: "0 0.5rem"}}
          href="#!"
        >
          <span className="material-icons" style={{position: "relative", top:"-2px"}}>
            delete
          </span>
        </a>

        <a
          className="btn-floating btn-large waves-effect waves-light white grey-text text-darken-2"
          style={{height: "2.5rem", width: "2.5rem"}}
          href="#!"
        >
          <span className="material-icons" style={{position: "relative", top:"-2px"}}>
            arrow_upward
          </span>
        </a>

      </td>
    </tr>
  )
}

const EditGroups = ({ db }) => {
  const [groupOptionState, setGroupOptionState] = useState([])

  const updateGroupOptions = async (db) => {
    const newGroupOptions = await getGroupOptions(db)
    setGroupOptionState(newGroupOptions
      )
  }

  useEffect(() => {
    updateGroupOptions(db)

  }, [db])

  return (
    <div className="menu-card">
      <h1>
        Edit Groups
      </h1>
      <div className="warning">
        <p>⚠️ Edit Groups menu under construction...</p>
      </div>

      <table className="highlight">
        <thead>
          <tr>
            <th>Group</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {groupOptionState.map((option, index) => <GroupEditRow group={option} index={index} /> )}
          <tr>
            <td>
              Add Group
            </td>
          </tr>
        </tbody>
      </table>

    </div>
  )
}

export default EditGroups
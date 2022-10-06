import { useEffect, useState } from "react"
import {
  doc,
  onSnapshot,
 } from "@firebase/firestore"

import {
  getGroupOptions,
  setGroupOptions,
} from "../../../services"

import {
  getSchoolId,
} from "../../../utils"

import {
  MenuDiv
} from "../../"

const GroupEditRow = ({ db, group, groupArray, index }) => {

  const handleClickUp = () => {
    var newGroupList = groupArray
    if (index !== 0) {
      newGroupList.splice(index, 1)    
      newGroupList.splice(index-1, 0, group)
      setGroupOptions(db, newGroupList)
    }

  }

  const handleClickDown = () => {
    var newGroupList = groupArray
    if (index !== groupArray.length) {
      newGroupList.splice(index, 1)    
      newGroupList.splice(index+1, 0, group)
      setGroupOptions(db, newGroupList)
    }

  }

  const handleClickDelete = async () => {
    var newGroupList = groupArray
    newGroupList.splice(index, 1)
    await setGroupOptions(db, newGroupList)
  }

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
          <span
            className="material-icons"
            style={{position: "relative", top:"-2px"}}
            onClick={handleClickDown}
          >
            arrow_downward
          </span>
        </a>

        <a
          className="btn-floating btn-large waves-effect waves-light white red-text text-lighten-1"
          style={{height: "2.5rem", width: "2.5rem", margin: "0 0.5rem"}}
          href="#!"
        >
          <span
            className="material-icons"
            style={{position: "relative", top:"-2px"}}
            onClick={handleClickDelete}
          >
            delete
          </span>
        </a>

        <a
          className="btn-floating btn-large waves-effect waves-light white grey-text text-darken-2"
          style={{height: "2.5rem", width: "2.5rem"}}
          href="#!"
        >
          <span
            className="material-icons"
            style={{position: "relative", top:"-2px"}}
            onClick={handleClickUp}
          >
            arrow_upward
          </span>
        </a>

      </td>
    </tr>
  )
}

const AddGroupButton = ({ onClick }) => {

  return (
    <tr>
      <td colSpan="2" onClick={onClick} style={{userSelect: 'none', cursor: 'pointer'}}>
        + Add Group
      </td>
    </tr>
  )
}

const AddGroupInput = ({ handleCancel, handleSubmit }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <tr>
      <div className="input-field" style={{margin: "0 0 0 1rem"}}>
        <input
          placeholder="Group Name"
          id="new-group-input"
          type="text"
          autoComplete="off"
          onKeyDown={handleKeyDown}
          style={{
            borderBottom: "none",
            marginTop: "0.75rem"
          }}
        />
      </div>
      
      <td>
        <span
          className="btn white grey-text"
          style={{marginRight: '1rem'}}
          onClick={handleCancel}
        >
          cancel
        </span>

        <span
          className="btn"
          onClick={handleSubmit}
        >
          save
        </span>
      </td>

    </tr>
  )
}

const EditGroups = ({ db }) => {
  const [groupOptionState, setGroupOptionState] = useState([])
  const [addingGroup, setAddingGroup] = useState(false)

  const updateGroupOptions = async (db) => {
    const newGroupOptions = await getGroupOptions(db)
    setGroupOptionState(newGroupOptions)
  }

  useEffect(() => {
    updateGroupOptions(db)

    // Create variables for the snapshot
    const schoolId = getSchoolId()
    const groupsRef = doc(
                  db,
                  "schools",
                  schoolId,
                  "config",
                  "student_groups");
    // Listen to updates to the group list
    const unsubscribe = onSnapshot(groupsRef, groupsSnap => {
      const newGroups = groupsSnap.data().groups
      // Make sure the update returned an Array
      if (Array.isArray( newGroups )) {
        // Update the state
        setGroupOptionState(newGroups)
      }
    })

    return () => unsubscribe()

  }, [db])

  const handleClickAdd = () => {
    setAddingGroup(true)
  }

  const handleCancelAdd = () => {
    var newGroupInput = document.getElementById('new-group-input')
    newGroupInput.value = ''
    setAddingGroup(false)
  }

  const handleSubmitAdd = () => {
    var newGroupName = document.getElementById('new-group-input').value
    var newGroupList = groupOptionState

    newGroupList.push(newGroupName)
    setGroupOptions(db, newGroupList)
    handleCancelAdd()
  }

  return (
    <div className="menu-card">
      <h1>
        Edit Groups
      </h1>
      
      <MenuDiv />

      <table className="highlight">
        <thead>
          <tr>
            <th>Group</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>

          {/* Group Rows */}
          {groupOptionState.map((option, index) => <GroupEditRow db={db} group={option} groupArray={groupOptionState} index={index} /> )}

          {/* Adding Groups */}
          { addingGroup
            ? <AddGroupInput handleCancel={handleCancelAdd} handleSubmit={handleSubmitAdd} />
            : <AddGroupButton onClick={handleClickAdd} />
          }

        </tbody>
      </table>

    </div>
  )
}

export default EditGroups
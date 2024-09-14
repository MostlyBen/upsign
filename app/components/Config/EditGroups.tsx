import { useEffect, useState } from "react"
import {
  doc,
  onSnapshot,
  Firestore,
} from "@firebase/firestore"

import {
  getGroupOptions,
  setGroupOptions,
} from "~/services"

import {
  getSchoolId,
} from "~/utils"
import { ArrowDown, ArrowUp, Trash } from "~/icons"

type RowProps = {
  db: Firestore,
  group: string,
  groupArray: string[],
  index: number,
}
const EditGroupRow = ({ db, group, groupArray, index }: RowProps) => {

  const handleClickUp = () => {
    const newGroupList = groupArray;
    if (index !== 0) {
      newGroupList.splice(index, 1);
      newGroupList.splice(index - 1, 0, group);
      setGroupOptions(db, newGroupList);
    }
  }

  const handleClickDown = () => {
    const newGroupList = groupArray;
    if (index !== groupArray.length) {
      newGroupList.splice(index, 1);
      newGroupList.splice(index + 1, 0, group);
      setGroupOptions(db, newGroupList);
    }

  }

  const handleClickDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${groupArray[index]}?`)) {
      const newGroupList = groupArray;
      newGroupList.splice(index, 1);
      await setGroupOptions(db, newGroupList);
    }
  }

  return (
    <tr>
      <td className="align-middle">
        {group}
      </td>
      <td className="join">

        <button
          className="btn btn-sm join-item"
          onClick={handleClickDown}
        >
          <ArrowDown />
        </button>

        <button
          className="btn btn-sm join-item text-error"
          onClick={handleClickDelete}
        >
          <Trash />
        </button>

        <button
          className="btn btn-sm join-item"
          onClick={handleClickUp}
        >
          <ArrowUp />
        </button>

      </td>
    </tr>
  )
}

const AddGroupButton = ({ onClick }: { onClick: () => void }) => {

  return (
    <tr>
      <td colSpan={2} onClick={onClick} style={{ userSelect: 'none', cursor: 'pointer' }}>
        + Add Group
      </td>
    </tr>
  )
}

const AddGroupInput = ({
  handleCancel,
  handleSubmit
}: {
  handleCancel: () => void,
  handleSubmit: () => void,
}) => {
  const handleKeyDown = (e: { key: string }) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }

  return (
    <tr>
      <input
        className="input input-bordered w-full"
        placeholder="Group Name"
        id="new-group-input"
        type="text"
        autoComplete="off"
        onKeyDown={handleKeyDown}
      />

      <td>
        <span
          className="btn white grey-text mr-2"
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

type EditGroupsProps = {
  db: Firestore,
}

const EditGroups = ({ db }: EditGroupsProps) => {
  const [groupOptionState, setGroupOptionState] = useState<string[]>([]);
  const [addingGroup, setAddingGroup] = useState<boolean>(false);

  const updateGroupOptions = async (db: Firestore) => {
    const newGroupOptions = await getGroupOptions(db);
    setGroupOptionState(newGroupOptions);
  }

  useEffect(() => {
    updateGroupOptions(db);

    // Create variables for the snapshot
    const schoolId = getSchoolId();
    const groupsRef = doc(db, `schools/${schoolId}/config/student_groups`);
    // Listen to updates to the group list
    const unsubscribe = onSnapshot(groupsRef, groupsSnap => {
      const newGroups = groupsSnap.data()?.groups;
      // Make sure the update returned an Array
      if (Array.isArray(newGroups)) {
        // Update the state
        setGroupOptionState(newGroups);
      }
    });

    return () => unsubscribe();

  }, [db]);

  const handleClickAdd = () => {
    setAddingGroup(true);
  }

  const handleCancelAdd = () => {
    const newGroupInput = document.getElementById('new-group-input') as HTMLInputElement;
    if (!newGroupInput) { return }
    newGroupInput.value = '';
    setAddingGroup(false);
  }

  const handleSubmitAdd = () => {
    const newGroupInput = document.getElementById('new-group-input') as HTMLInputElement;
    const newGroupName = newGroupInput.value;
    const newGroupList = groupOptionState;

    newGroupList.push(newGroupName);
    setGroupOptions(db, newGroupList);
    handleCancelAdd();
  }

  return (
    <div className="prose">
      <h1>
        Edit Groups
      </h1>

      <hr className="my-2" />

      <table className="highlight">
        <thead>
          <tr>
            <th>Group</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>

          {/* Group Rows */}
          {groupOptionState.map((option, index) => <EditGroupRow
            key={`option-${index}`}
            db={db}
            group={option}
            groupArray={groupOptionState}
            index={index}
          />)}

          {/* Adding Groups */}
          {addingGroup
            ? <AddGroupInput handleCancel={handleCancelAdd} handleSubmit={handleSubmitAdd} />
            : <AddGroupButton onClick={handleClickAdd} />
          }

        </tbody>
      </table>

    </div>
  )
}

export default EditGroups;


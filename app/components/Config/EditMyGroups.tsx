import { useEffect, useState } from "react"
import { Link } from "@remix-run/react"
import {
  doc,
  onSnapshot,
  Firestore,
} from "@firebase/firestore"

import {
  getUserGroupOptions,
  setUserGroupOptions,
} from "~/services"

import {
  getSchoolId,
} from "~/utils"
import { ArrowDown, ArrowUp, Trash } from "~/icons"

type RowProps = {
  db: Firestore,
  userId: string,
  group: string,
  groupArray: string[],
  index: number,
}
const EditGroupRow = ({ db, userId, group, groupArray, index }: RowProps) => {
  if (!group.startsWith("%t-")) {
    // TODO: Replace group to be formatted with %t-userId-groupName
    return <></>
  }

  const handleClickUp = () => {
    const newGroupList = groupArray;
    if (index !== 0) {
      newGroupList.splice(index, 1);
      newGroupList.splice(index - 1, 0, group);
      setUserGroupOptions(db, userId, newGroupList);
    }
  }

  const handleClickDown = () => {
    const newGroupList = groupArray;
    if (index !== groupArray.length) {
      newGroupList.splice(index, 1);
      newGroupList.splice(index + 1, 0, group);
      setUserGroupOptions(db, userId, newGroupList);
    }

  }

  const handleClickDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${groupArray[index]}?`)) {
      const newGroupList = groupArray;
      newGroupList.splice(index, 1);
      await setUserGroupOptions(db, userId, newGroupList);
    }
  }

  return (
    <tr>
      <td className="align-middle w-full">
        {group.split("-")[2]}
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
    <div>
      <button className="btn" onClick={onClick} style={{ userSelect: 'none', cursor: 'pointer' }}>
        + Add Group
      </button>
    </div>
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
    <div className="flex flex-row gap-2 w-full">
      <input
        className="input input-bordered grow"
        placeholder="Group Name"
        id="new-group-input"
        type="text"
        autoComplete="off"
        onKeyDown={handleKeyDown}
      />

      <button
        className="btn white grey-text"
        onClick={handleCancel}
      >
        cancel
      </button>

      <button
        className="btn btn-primary"
        onClick={handleSubmit}
      >
        save
      </button>

    </div>
  )
}

type EditGroupsProps = {
  db: Firestore,
  userId: string,
}

const EditGroups = ({ db, userId }: EditGroupsProps) => {
  const [groupOptionState, setGroupOptionState] = useState<string[]>([]);
  const [addingGroup, setAddingGroup] = useState<boolean>(false);

  const updateGroupOptions = async (db: Firestore) => {
    const newGroupOptions = await getUserGroupOptions(db, userId);
    setGroupOptionState(newGroupOptions);
  }

  useEffect(() => {
    updateGroupOptions(db);

    // Create variables for the snapshot
    const schoolId = getSchoolId();
    const groupsRef = doc(db, `schools/${schoolId}/users/${userId}/user_config/student_groups`);
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
    const newGroupName = `%t-${userId}-${newGroupInput.value}`;
    const newGroupList = groupOptionState;

    newGroupList.push(newGroupName);
    setUserGroupOptions(db, userId, newGroupList);
    handleCancelAdd();
  }

  return (
    <div className="prose">
      <h1>
        My Groups
      </h1>
      <blockquote className="border-primary">
        Only you will see the groups you add here.
        <br />
        You can add or remove students in the regular <Link to="/config/groups">Groups</Link> menu.
      </blockquote>

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
            userId={userId}
            db={db}
            group={option}
            groupArray={groupOptionState}
            index={index}
          />)}


        </tbody>
      </table>

      {/* Adding Groups */}
      {addingGroup
        ? <AddGroupInput handleCancel={handleCancelAdd} handleSubmit={handleSubmitAdd} />
        : <AddGroupButton onClick={handleClickAdd} />
      }

    </div>
  )
}

export default EditGroups;


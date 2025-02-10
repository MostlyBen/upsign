import { useState } from "react";
import { Firestore } from "@firebase/firestore";
import { useConfirmModal } from "~/hooks";
import { UpsignUser, Session } from "~/types";
import { Person, UserGroup } from "~/icons";
import { batchEnroll, enrollStudent, getIsLocked } from "~/services";

type AddStudentsProps = {
  db: Firestore,
  session: Session,
  user: UpsignUser,
  date: Date,
  groupOptions: string[],
  allStudents: UpsignUser[],
}

const UserName = ({ user, onClick }:
  { user: UpsignUser, onClick: () => void }
) => {
  return (
    <button
      className="flex justify-start gap-2 leading-6 btn btn-ghost w-full text-left"
      onClick={onClick}
    >
      <Person />
      <span>{user.nickname ?? user.name}</span>
    </button>
  )
}

const GroupName = ({ group, onClick }:
  { group: string, onClick: () => void }
) => {
  return (
    <button
      className="flex justify-start gap-2 leading-6 btn btn-ghost w-full text-left"
      onClick={onClick}
    >
      <UserGroup />
      {group.startsWith("%t-") ? `${group.split("-")[2]} (your group)` : group}
    </button>
  )
}

const AddStudents = ({
  db,
  session,
  user,
  date,
  groupOptions,
  allStudents,
}: AddStudentsProps) => {
  const [search, setSearch] = useState<string>("");
  const [searchShown, setSearchShown] = useState<boolean>(false);
  const [enrolling, setEnrolling] = useState<boolean>(false);
  const [confirm, ConfirmModal] = useConfirmModal({ id: `confirm-modal-${session.id}` });

  const handleAddStudent = async (student: UpsignUser) => {
    setSearchShown(false);
    setSearch("");
    if (!session.id) { return }

    const isLocked = await getIsLocked(db, date, session.session, student);
    if (isLocked) {
      const userConfirm = await confirm(
        `${student.nickname ?? student.name} is locked into ${isLocked.title} with ${isLocked.teacher}.`
      );
      if (!userConfirm) { return }
    }

    enrollStudent(db, date, session, student, user, true);
  }

  const handleAddGroup = (group: string) => {
    setEnrolling(true);
    setSearchShown(false);
    setSearch("");

    if (!session.id) { return }

    const groupStudents = allStudents.filter(u => {
      return u.groups?.includes(group);
    });

    batchEnroll(db, date, session, groupStudents, user, confirm).then((res) => {
      setEnrolling(false);
      if (!res.success) {
        console.error(res.error);
      }
    });
  }


  return (
    <>
      <div>
        <label
          className="input input-bordered flex items-center gap-2 w-full no-focus-no-border"
          htmlFor="user-name-box"
        >
          <input
            className="bg-base-100 w-full"
            placeholder="Add Student(s)"
            type="text"
            id="user-name-box"
            autoComplete="off"
            value={search}
            onChange={e => { setSearch(e.target.value); setSearchShown(true) }}
            onBlur={() => {
              setTimeout(() => {
                setSearchShown(false);
                setSearch("");
              }, 150);
            }}
            style={{
              fontSize: "0.875rem",
              paddingLeft: "0.5rem",
            }}
          />
        </label>

        <div
          className="absolute z-30 card bg-base-100 shadow-md p-2"
          style={{
            display: (searchShown && search.length > 0) ? "block" : "none",
            minWidth: "min(256px, 100vw)",
            minHeight: "64px",
          }}
        >
          {groupOptions.filter(g => {
            return g.toLowerCase().includes(search.toLowerCase())
          }).map((group, index) => {
            return <div key={`group-${index}`}><GroupName group={group} onClick={() => handleAddGroup(group)} /></div>
          })}

          {allStudents.filter(u => {
            return (
              (u.nickname && u.nickname.toLowerCase().includes(search.toLowerCase())) ||
              (u.name && u.name.toLowerCase().includes(search.toLowerCase()))
            )
          }).map((user, index) => {
            return <div key={`user-${index}`}><UserName user={user} onClick={() => handleAddStudent(user)} /></div>
          })}
        </div>
      </div>

      {ConfirmModal}
      {enrolling &&
        <div
          className="absolute z-30 top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-base-100 opacity-80"
        >
          <span
            className="loading loading-spinner loading-lg opacity-80"
          />
        </div>}
    </>
  )
}

export default AddStudents;


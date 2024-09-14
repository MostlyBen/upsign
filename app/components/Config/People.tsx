import { Firestore } from "firebase/firestore"
import { useEffect, useState } from "react"
import { Person, Trash } from "~/icons"


import {
  getAllUsers,
  deleteUser,
  updateUser,
} from "~/services"
import { UpsignUser } from "~/types"

type NameProps = {
  user: UpsignUser,
  selectUser: (arg0: string, arg1: boolean) => void,
}
const NamesListName = ({ user, selectUser }: NameProps) => {
  const closeModal = (uid: string) => {
    selectUser(uid, true);
  }

  return (
    <button className="leading-6 btn btn-ghost block w-full text-left" onClick={() => closeModal(user.uid as string)}>
      {/* Name */}
      <span>{user.nickname ?? user.name}</span>
      {/* Email */}
      <span className="opacity-60 ml-2 font-light">{user.email}</span>
      {/* User Type */}
      <span style={{ color: "grey", float: "right" }}>
        {user.type && user.type.charAt(0).toUpperCase() + user.type.slice(1)}
      </span>
    </button>
  )
}

type PeopleProps = {
  db: Firestore,
}

const People = ({ db }: PeopleProps) => {
  const [userList, setUserList] = useState<UpsignUser[]>([]);
  const [userIdFinder, setUserIdFinder] = useState<Record<string, string>>({});
  const [selectedUser, setSelectedUser] = useState<UpsignUser | null>();
  const [search, setSearch] = useState<string>("");
  const [searchShown, setSearchShown] = useState<boolean>(false);

  const updateUserList = async (db: Firestore) => {
    const allUsers = await getAllUsers(db) as UpsignUser[];
    allUsers.sort((a, b) => ((a.nickname ?? a.name) > (b.nickname ?? b.name)) ? 1 : -1);
    setUserList(allUsers);
  }

  const updateSelectedUser = (str: string, asUid = false) => {
    if (!userIdFinder) { return }

    const uid = asUid ? str : userIdFinder[str];

    const filteredArr = userList.filter(user => user.uid === uid);
    const userObject = filteredArr[0];

    setSelectedUser(userObject);
  }

  useEffect(() => {
    setSearchShown(search.length > 0 && !selectedUser);
  }, [search, selectedUser]);

  useEffect(() => {
    updateUserList(db)
  }, [db])

  useEffect(() => {
    const newUserIdFinder: Record<string, string> = {};

    for (const i in userList) {
      const user = userList[i];
      const name = user.nickname ?? user.name;
      newUserIdFinder[name] = user.uid as string;
    }

    setUserIdFinder(newUserIdFinder);
  }, [userList]);

  const updateDropdown = (userType: string) => {
    const elem = document.getElementById("user-type-select") as HTMLSelectElement;
    if (elem !== null) {
      for (const option of elem.options) {
        if (option.value === userType) {
          option.selected = true;
          return;
        }
      }
    } else {
      setTimeout(updateDropdown, 15);
    }
  }

  useEffect(() => {
    const nameInputElem = document.getElementById('user-name-box') as HTMLInputElement;
    const nameElem = document.getElementById('user-name') as HTMLInputElement;
    const emailElem = document.getElementById('user-email') as HTMLInputElement;
    const nicknameElem = document.getElementById('user-nickname') as HTMLInputElement;

    if (selectedUser) {
      nameInputElem.value = selectedUser.nickname ?? selectedUser.name ?? '';
      nameElem.value = selectedUser.name ?? '';
      emailElem.value = selectedUser.email ?? '';
      nicknameElem.value = selectedUser.nickname ?? '';
      updateDropdown(selectedUser.type ?? '');
    } else {
      nameInputElem.value = '';
      nameElem.value = '';
      emailElem.value = '';
      nicknameElem.value = '';
      updateDropdown('');
    }

  }, [selectedUser]);

  const handleChangeNickname = async (e: { target: { value: string } }) => {
    if (!selectedUser?.uid) { return }
    const newNickname = e.target.value;

    if (typeof newNickname === 'string' && newNickname.length > 0) {
      await updateUser(db, selectedUser.uid, { nickname: newNickname })
    } else {
      await updateUser(db, selectedUser.uid, 'nickname', null, true)
    }
  }

  const handleChangeUserType = async () => {
    if (!selectedUser?.uid) { return }

    const elem = document.getElementById("user-type-select") as HTMLSelectElement;
    const value = elem.value;

    await updateUser(db, selectedUser.uid, { type: value });
  }

  const handleDeleteUser = () => {
    if (!selectedUser?.uid) { return }

    if (window.confirm(`Are you sure you want to remove ${selectedUser.nickname ?? selectedUser.name} from this school?`)) {
      deleteUser(db, selectedUser.uid)
      setSelectedUser(null)
    }
    updateUserList(db);
  }

  return (
    <div className="prose">
      <h1>
        Manage People
      </h1>

      {/* Names List Modal */}
      <dialog id="names-modal" className="modal prose card">
        <div className="modal-box row">
          <h3 className="mt-0">All Users</h3>
          <hr className="my-2" />
          <div className="overflow-y-auto" style={{ maxHeight: "80dvh" }}>
            <form method="dialog">
              {userList.map(user =>
                (<NamesListName user={user} selectUser={updateSelectedUser} key={`user-name-${user.uid}`} />)
              )}
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      <div className="row">
        {/* User Search Menu */}
        <div className="col s12">
          <hr className="my-4" />
          <h2>Select Person</h2>
          <div className="mb-2">
            <label className="input input-bordered flex items-center gap-2 w-full" htmlFor="user-name-box">
              <span className="opacity-80"><Person /></span>
              <input
                className="bg-base-100 w-full"
                placeholder="Name"
                type="text"
                id="user-name-box"
                autoComplete="off"
                onFocus={() => setSelectedUser(null)}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </label>
          </div>

          <div
            className="absolute z-30 card bg-base-100 shadow-md p-2"
            style={{ display: searchShown ? "block" : "none", width: "calc(100% - 64px)" }}
          >
            {userList.filter(u => {
              return (
                (u.nickname && u.nickname.toLowerCase().includes(search.toLowerCase())) ||
                (u.name && u.name.toLowerCase().includes(search.toLowerCase())) ||
                (u.email && u.email.toLowerCase().includes(search.toLowerCase()))
              )
            }).map((user, index) => {
              return <NamesListName key={`${user.name}-${index}`} user={user} selectUser={updateSelectedUser} />
            })}
          </div>

          <button
            className="btn btn-primary"
            onClick={() => document.getElementById("names-modal")?.showModal()}
          >
            List All Users
          </button>

          <hr className="my-4" />
        </div>

        {/* Student Info Section */}
        <h2>Edit Person</h2>

        <div className="grid grid-cols-2 gap-4">
          {/* Name */}
          <div className="">
            <div className="">Name</div>
            <input
              className="input input-disabled w-full"
              placeholder="User Name"
              id="user-name"
              type="text"
            />
          </div>

          {/* Email */}
          <div className="">
            <div className="">Email</div>
            <input
              className="input input-disabled w-full"
              placeholder="Email"
              id="user-email"
              type="text"
            />
          </div>

          {/* Nickname */}
          <div className="">
            <div>Preferred Name</div>
            <input
              className="input input-bordered w-full"
              placeholder="Not Set"
              id="user-nickname"
              type="text"
              autoComplete="off"
              onChange={handleChangeNickname}
            />
          </div>

          {/* Type */}
          <div className="">
            <div>Role</div>
            <select
              className="select select-bordered w-full"
              id="user-type-select"
              onChange={handleChangeUserType}
              defaultValue=""
            >
              <option value="" disabled>User Role</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>
          </div>

        </div>

        {/* Delete User */}
        <div className="mt-4">
          <div className="btn text-error" onClick={handleDeleteUser}>
            <Trash />
            Delete User
          </div>
        </div>

      </div>
    </div>
  )
}

export default People


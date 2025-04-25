// TODO: Move teacher switch button to the top message by your name

import { Firestore } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Close, Person } from "~/icons";
import { NameListName } from "~/components";


import {
  getAllTeachers,
} from "~/services"
import { UpsignUser } from "~/types"

type TeacherSelectProps = {
  db: Firestore,
  onSelect: (arg0: string | null) => void,
}

const TeacherSelect = ({ db, onSelect }: TeacherSelectProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const [userList, setUserList] = useState<UpsignUser[]>([]);
  const [userIdFinder, setUserIdFinder] = useState<Record<string, string>>({});
  const [selectedUser, setSelectedUser] = useState<UpsignUser | null>();
  const [search, setSearch] = useState<string>("");
  const [searchShown, setSearchShown] = useState<boolean>(false);

  const updateUserList = async (db: Firestore) => {
    const allUsers = await getAllTeachers(db) as UpsignUser[];
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
  }, [db]);

  useEffect(() => {
    onSelect(selectedUser?.uid ?? null);
  }, [selectedUser]);

  useEffect(() => {
    const newUserIdFinder: Record<string, string> = {};

    for (const i in userList) {
      const user = userList[i];
      const name = user.nickname ?? user.name;
      newUserIdFinder[name] = user.uid as string;
    }

    setUserIdFinder(newUserIdFinder);
  }, [userList]);

  if (!open) {
    return (
      <div className="relative print:hidden">
        <button
          className="btn btn-ghost"
          onClick={() => setOpen(!open)}
        >
          Show other teacher&apos;s schedule
        </button>
      </div>
    )
  }

  return (
    <div className="relative mb-4 print:hidden">
      <div className="flex row gap-2">
        <label className="input input-bordered inline-flex items-center gap-2 w-full" htmlFor="user-name-box">
          <span className="opacity-80"><Person /></span>
          <input
            className="bg-base-100 w-full"
            placeholder="Name"
            type="text"
            id="teacher-search-box"
            autoComplete="off"
            onFocus={() => setSelectedUser(null)}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </label>

        <button
          className="btn btn-ghost"
          onClick={() => {
            onSelect(null);
            setSearch("");
            setOpen(false);
          }}>
          <Close />
        </button>

        <div
          className="absolute card bg-base-100 shadow-md p-2"
          style={{ zIndex: 1000, display: searchShown ? "block" : "none", width: "calc(100% - 64px)" }}
        >
          {userList.filter(u => {
            return (
              (u.nickname && u.nickname.toLowerCase().includes(search.toLowerCase())) ||
              (u.name && u.name.toLowerCase().includes(search.toLowerCase())) ||
              (u.email && u.email.toLowerCase().includes(search.toLowerCase()))
            )
          }).map((user, index) => {
            return <NameListName key={`${user.name}-${index}`} user={user} selectUser={updateSelectedUser} />
          })}
        </div>

      </div>

    </div>
  )
}

export default TeacherSelect;


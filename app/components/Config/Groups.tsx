import { useState, useEffect } from "react";
import { Firestore, collection, onSnapshot } from "firebase/firestore";
import areEqual from 'deep-equal';
import { getAllStudents, getGroupOptions } from "~/services";
import { getSchoolId } from '~/utils';
import { UpsignUser } from "~/types";
import { Funnel, Person } from "~/icons";
import StudentName from "./Groups/StudentName";

type StudentGroupsProps = {
  db: Firestore,
  userId?: string,
}
const StudentGroups = ({ db, userId }: StudentGroupsProps) => {
  const [groupOptions, setGroupOptions] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [allStudents, setAllStudents] = useState<UpsignUser[]>([]);
  const [search, setSearch] = useState<string>("");
  const [filterGroup, setFilterGroup] = useState<string>("");
  const [filteredStudents, setFilteredStudents] = useState<UpsignUser[]>([]);

  const schoolId = getSchoolId()

  const updateGroupOptions = async () => {
    const options = await getGroupOptions(db, userId);
    if (!areEqual(options, groupOptions)) {
      setGroupOptions(options);
    }
  }

  const getStudents = async () => {
    getAllStudents(db).then(students => {
      if (Array.isArray(students)) {
        students.sort((a, b) => ((a.nickname ?? a.name) > (b.nickname ?? b.name)) ? 1 : -1);
        setAllStudents(students);
      }
    })
  }

  useEffect(() => {
    updateGroupOptions()
    getStudents()

    const usersRef = collection(db, `schools/${schoolId}/users`);

    const unsubscribe = onSnapshot(usersRef, () => {
      getStudents();
    })

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (typeof groupOptions[0] === "string") {
      setSelectedGroup(groupOptions[0])
    }
  }, [groupOptions]);

  useEffect(() => {
    if (selectedGroup === filterGroup) {
      setFilterGroup("");
    }
  }, [selectedGroup]);

  useEffect(() => {
    if (!search.length && !filterGroup) {
      setFilteredStudents(allStudents);
      return;
    }

    const filteredArr = allStudents.filter(student => {
      return (
        ((student.nickname && student.nickname.toLowerCase().includes(search.toLowerCase())) ||
          (student.name && student.name.toLowerCase().includes(search.toLowerCase())) ||
          (student.email && student.email.toLowerCase().includes(search.toLowerCase()))) &&
        (filterGroup === "" || student.groups?.includes(filterGroup))
      )
    });

    setFilteredStudents(filteredArr);
  }, [allStudents, filterGroup, search]);

  return (
    <div className="prose">
      <h1 className="mb-4">Student Groups</h1>

      {/* Group Select */}
      <h4 className="mt-0">Add/Remove From:</h4>
      <select
        id="group-select"
        className="select select-bordered w-full mb-4 bg-base-100"
        onChange={(e) => setSelectedGroup(e.target.value)}
        value={selectedGroup}
      >
        {groupOptions.map((option, index) => {
          return (
            <option
              value={option}
              key={`group-options-${option}-${index}`}
            >
              {option.startsWith("%t-") ? `${option.split("-")[2]} (your group)` : option}
            </option>
          )
        })}
      </select>

      {/* Search */}
      <h4 className="mt-0">Filters:</h4>
      <div className="md:flex md:flex-row gap-4">
        <label className="input input-bordered flex items-center gap-2 w-full mb-4" htmlFor="user-name-box">
          <span className="opacity-80"><Person /></span>
          <input
            className="bg-base-100 w-full"
            placeholder="Name"
            type="text"
            id="user-name-box"
            autoComplete="off"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setSearch("")}
          />
        </label>
        <label className="input input-bordered flex items-center gap-2 w-full mb-4 pr-0" htmlFor="user-group-filter">
          <span className="opacity-80"><Funnel /></span>
          <select className="w-full h-full rounded-lg cursor-pointer bg-base-100"
            id="user-group-filter"
            onChange={e => setFilterGroup(e.target.value)}
            value={filterGroup}
          >
            <option value="">All Students</option>
            {groupOptions.map((option, index) => {
              if (option === selectedGroup) { return <></> }
              return (
                <option
                  value={option}
                  key={`group-options-${option}-${index}`}
                >
                  {option.startsWith("%t-") ? `${option.split("-")[2]} (your group)` : option}
                </option>
              )
            })}
          </select>
        </label>
      </div>

      {/* Student List */}
      <div className="grid grid-cols-2 gap-2" style={{ maxHeight: "calc(100dvh - 36rem)", overflowY: "auto" }}>
        <div>
          <h2 className="mt-0 mb-2 text-center">Not in {selectedGroup.length
            ? selectedGroup.startsWith("%t-")
              ? `${selectedGroup.split("-")[2]}`
              : selectedGroup
            : "Group"}</h2>
          {filteredStudents.filter(s => !s.groups?.includes(selectedGroup)).map((student, index) => {
            return (
              <StudentName
                db={db}
                student={student}
                selectedGroup={selectedGroup}
                key={`student-${student.uid}-${index}`}
              />
            )
          })}
        </div>
        <div>
          <h2 className="mt-0 mb-2 text-center">In {selectedGroup.length
            ? selectedGroup.startsWith("%t-")
              ? `${selectedGroup.split("-")[2]}`
              : selectedGroup
            : "Group"}</h2>
          {filteredStudents.filter(s => s.groups?.includes(selectedGroup)).map((student, index) => {
            return (
              <StudentName
                db={db}
                student={student}
                selectedGroup={selectedGroup}
                key={`student-${student.uid}-${index}`}
                inGroup
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default StudentGroups;


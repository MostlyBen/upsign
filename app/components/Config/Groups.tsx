import { useState, useEffect } from "react";
import { Firestore, collection, onSnapshot } from "firebase/firestore";
import areEqual from 'deep-equal';
import { getAllStudents, getGroupOptions, getUser, updateUser } from "~/services";
import { getSchoolId } from '~/utils';
import { UpsignUser } from "~/types";

type StudentGroupsProps = {
  db: Firestore,
}
const StudentGroups = ({ db }: StudentGroupsProps) => {
  const [groupOptions, setGroupOptions] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [allStudents, setAllStudents] = useState<UpsignUser[]>([]);

  const schoolId = getSchoolId()

  const updateGroupOptions = async () => {
    const options = await getGroupOptions(db)
    if (!areEqual(options, groupOptions)) {
      setGroupOptions(options)
    }
  }

  const getStudents = async () => {
    getAllStudents(db).then(students => {
      if (Array.isArray(students)) {
        students.sort((a, b) => ((a.nickname ?? a.name) > (b.nickname ?? b.name)) ? 1 : -1)
        setAllStudents(students)
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
  }, [groupOptions])

  const handleClickStudent = async (student: UpsignUser) => {
    if (!student.uid) { return }

    getUser(db, student.uid)
      .then(studentDoc => {
        if (!studentDoc) { return }

        if (Array.isArray(studentDoc.groups)) {
          if (studentDoc.groups.includes(selectedGroup)) {
            const g = studentDoc.groups.filter(obj => {
              return obj !== selectedGroup
            })
            studentDoc.groups = g
          } else {
            studentDoc.groups.push(selectedGroup)
          }
          // Student had no groups
        } else {
          studentDoc.groups = [selectedGroup]
        }

        return studentDoc
      }).then(studentDoc => {
        if (!student || !studentDoc) { return }
        updateUser(db, student.uid as string, { groups: studentDoc.groups })
      });

  }

  return (
    <div className="prose">
      <h1>Student Groups</h1>

      <div>Key:</div>
      <div className="flex flex-row gap-4 mb-4">
        <button className="btn grow pointer-events-none">Is <b>not</b> in Group</button>
        <button className="btn btn-primary grow pointer-events-none"><b>Is</b> in Group</button>
      </div>

      <div>Group:</div>
      <select
        id="group-select"
        className="select select-bordered w-full mb-4"
        onChange={(e) => setSelectedGroup(e.target.value)}
      >
        {groupOptions.map(option => {
          return (
            <option
              value={option}
              key={`group-options-${option}-${Math.floor(Math.random() * 10000)}`}
              selected={option === selectedGroup}
            >
              {option}
            </option>
          )
        })}
      </select>

      {/* Student List */}
      <div style={{ maxHeight: "48vh", overflowY: "auto" }}>
        {allStudents.map(student => {
          return (
            <button
              className={`btn mb-1 w-full block ${Array.isArray(student.groups)
                ? student.groups.includes(selectedGroup) ? "btn-primary" : ""
                : ""
                }`}
              key={`student-${student.uid}`}
              onClick={() => handleClickStudent(student)}
            >
              {student.nickname ?? student.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default StudentGroups


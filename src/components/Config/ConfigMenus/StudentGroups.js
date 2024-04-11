import { useState, useEffect, useMemo } from "react";
import { collection,onSnapshot } from "firebase/firestore";
import areEqual from 'deep-equal'
import { getAllStudents, getGroupOptions, getUser, updateUser } from "../../../services"
import { getSchoolId } from '../../../utils';
import M from "materialize-css";


const StudentGroups = ({ db }) => {
  const [groupOptions, setGroupOptions] = useState([])
  const [selectedGroup, setSelectedGroup] = useState("")
  const [allStudents, setAllStudents] = useState([])

  const schoolId = getSchoolId()

  const GroupSelect = useMemo(() => {
    return (
      <select
        id={`group-select`}
        className="btn group-dropdown"
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
    )
  }, [db])

  const updateGroupOptions = async () => {
    const options = await getGroupOptions(db)
    if (!areEqual(options, groupOptions)) {
      setGroupOptions(options)
    }
  }

  const getStudents = async () => {
    getAllStudents(db).then(students => {
      if (Array.isArray(students)) {
        students.sort( (a, b) => ( (a.nickname ?? a.name) > (b.nickname ?? b.name) ) ? 1 : -1 )
        setAllStudents(students)
      }
    })
  }

  useEffect(() => {
    updateGroupOptions()
    getStudents()

    const usersRef = collection(db, "schools", schoolId, "users")

    const unsubscribe = onSnapshot(usersRef, () => {
      getStudents()
    })

    return () => unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (typeof groupOptions[0] === "string") {
      setSelectedGroup(groupOptions[0])
    }
  }, [groupOptions])

  const handleClickStudent = async (student) => {
    getUser(db, student.uid)
      .then(studentDoc => {
        if (Array.isArray(studentDoc.groups)) {
          if (studentDoc.groups.includes(selectedGroup)) {
            let g = studentDoc.groups.filter(obj => {
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
        updateUser(db, student.uid, { groups: studentDoc.groups })
      })

  }
  
  return (
    <div>
      <h1 style={{marginBottom: "1rem"}}>Student Groups</h1>

      <select
        id={`group-select`}
        className="btn group-dropdown"
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
      <div className="collection" style={{maxHeight: "50vh", overflowY: "auto"}}>
        {allStudents.map(student => {
          return(
            <a
              href="#!"
              className={`collection-item ${
                Array.isArray(student.groups)
                ? student.groups.includes(selectedGroup) ? "active" : ""
                : ""
              }`}
              key={`student-${student.uid}`}
              onClick={() => handleClickStudent(student)}
            >
              {student.nickname ?? student.name}
            </a>
          )
        })}
      </div>
    </div>
  )
}

export default StudentGroups
import { useState, useEffect } from "react";
import { collection,onSnapshot } from "firebase/firestore";
import areEqual from 'deep-equal'
import { getAllUsers, getGroupOptions } from "../../../services"
import { getSchoolId } from '../../../utils';
import M from "materialize-css";


const StudentList = ({ db }) => {
  const [groupOptions, setGroupOptions] = useState([])
  const [selectedGroup, setSelectedGroup] = useState("")
  const [allStudents, setAllStudents] = useState([])

  const schoolId = getSchoolId()

  const updateGroupOptions = async () => {
    const options = await getGroupOptions(db)
    if (!areEqual(options, groupOptions)) {
      setGroupOptions(options)
    }
  }

  const getStudents = async () => {
    getAllUsers(db).then(students => {
      if (Array.isArray(students)) {
        students.sort( (a, b) => ( (a.nickname ?? a.name) > (b.nickname ?? b.name) ) ? 1 : -1 )
        setAllStudents(students)
      }
    })
  }

  useEffect(() => {
    updateGroupOptions()
    getStudents()

    // --------------- FOR LATER ---------------
    // Use the next 3 lines to re-initialize if list is updated (untested)
    // var instance = M.Dropdown.getInstance(elem);
    // instance.destroy()
    M.AutoInit()

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

  
  return (
    <div>
      <h1 style={{marginBottom: "1rem"}}>All User Emails</h1>

      {/* Student List */}
      <div>
        {allStudents.map(student => {
          return(
            <span
              href="#!"
              className={`collection-item ${
                Array.isArray(student.groups)
                ? student.groups.includes(selectedGroup) ? "active" : ""
                : ""
              }`}
              key={`student-${student.uid}`}
            >
              {student.email}, 
            </span>
          )
        })}
      </div>
    </div>
  )
}

export default StudentList
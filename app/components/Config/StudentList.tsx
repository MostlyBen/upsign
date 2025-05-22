import { Firestore, collection, onSnapshot } from "firebase/firestore";
import { useState, useEffect } from "react";
import { getSchoolId } from "~/utils";
import { getGroupOptions, getAllUsers } from "~/services";

type StudentListProps = {
  db: Firestore,
}

const StudentList = ({ db }: StudentListProps) => {
  const [groupOptions, setGroupOptions] = useState<String[]>([])
  const [selectedGroup, setSelectedGroup] = useState("")
  const [allStudents, setAllStudents] = useState<any[]>([])

  const schoolId = getSchoolId()

  const updateGroupOptions = async () => {
    const options = await getGroupOptions(db)
    setGroupOptions(options)
  }

  const getStudents = async () => {
    getAllUsers(db).then(students => {
      if (Array.isArray(students)) {
        students.sort((a, b) => ((a.nickname ?? a.name) > (b.nickname ?? b.name)) ? 1 : -1)
        setAllStudents(students)
      }
    })
  }

  useEffect(() => {
    updateGroupOptions()
    getStudents()

    if (!db || !schoolId) { return }
    const usersRef = collection(db, "schools", schoolId, "users")

    const unsubscribe = onSnapshot(usersRef, () => {
      getStudents()
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (typeof groupOptions[0] === "string") {
      setSelectedGroup(groupOptions[0])
    }
  }, [groupOptions])


  return (
    <div>
      <h1 style={{ marginBottom: "1rem" }}>All User Emails</h1>

      {/* Student List */}
      <div>
        {allStudents.map(student => {
          return (
            <span
              className={`collection-item ${Array.isArray(student.groups)
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

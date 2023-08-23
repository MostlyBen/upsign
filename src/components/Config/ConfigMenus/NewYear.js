import { useEffect, useState } from "react"
import {
  doc,
  onSnapshot,
 } from "@firebase/firestore"

import {
  getAllStudents,
  updateUser,
} from "../../../services"

import {
  getSchoolId,
} from "../../../utils"

import {
  MenuDiv
} from "../../"

const getNewGroups = (groups) => {
  if (groups.includes('9th Grade')) {
    return ['10th Grade']
  } else if (groups.includes('10th Grade')) {
    return ['11th Grade']
  } else if (groups.includes('11th Grade')) {
    return ['12th Grade']
  } else {
    console.warn(`Invalid groups: ${groups}`)
    return ['12th Grade']
  }
}

const NewYear = ({ db }) => {
  const [ allStudents, setAllStudents ] = useState([])

  useEffect(() => {
    const updateAllStudents = async (db) => {
      const schoolId = getSchoolId()
      const allStudents = await getAllStudents(db, schoolId)
      console.log(Object.keys(allStudents))
      var newArr = []
      for (var id in allStudents) {
        console.log(id)
        newArr.push({id, ...allStudents[id]})
      }
      console.log(newArr)
      setAllStudents(newArr)
    }

    updateAllStudents(db)

  }, [db])

  const updateGroups = async () => {
    if (window.confirm('Are you sure? This will remove all student groups and change their grades.')) {
      console.log('updating groups')
      const schoolId = getSchoolId()
      for (var student of allStudents) {
        const newGroups = getNewGroups(student.groups)
        console.log(student.name, student.groups, '->',newGroups)
        await updateUser(db, student.id, {groups: newGroups}, schoolId)
      }
    }
  }

  return (
    <div className="menu-card">
      <h1>
        New Year
      </h1>

      <MenuDiv />

      <button onClick={updateGroups}>Update for the new year.</button>
      {Array.isArray(allStudents) && allStudents.map((student, index) => {
        return (
          <div key={index}>
            <p>{student.name}</p>
            <p>{JSON.stringify(student.groups)}</p>
          </div>
        )
      })}
    </div>
  )
}

export default NewYear
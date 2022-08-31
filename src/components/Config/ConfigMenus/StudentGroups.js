import { useState, useEffect } from "react";
import { doc, collection, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { getAllStudents, getGroups } from "../../../services"
import { getSubdomain } from '../../../utils';
import M from "materialize-css";


const StudentGroups = ({ db }) => {
  const [groupOptions, setGroupOptions] = useState([])
  const [selectedGroup, setSelectedGroup] = useState("")
  const [allStudents, setAllStudents] = useState([])

  const schoolId = getSubdomain()

  const updateGroupOptions = async () => {
    const options = await getGroups(db)
    setGroupOptions(options)
  }

  const getStudents = async () => {
    getAllStudents(db).then(students => {
      if (Array.isArray(students)) {
        students.sort( (a, b) => (a.name > b.name) ? 1 : -1 )
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

  const handleClickStudent = (student) => {
    const studentRef = doc(db, "schools", schoolId, "users", student.uid)
    getDoc(studentRef)
    .then(studentSnap => {
      if (studentSnap.exists()) {
        const studentDoc = studentSnap.data()

        if (Array.isArray(studentDoc.groups)) {
          if (studentDoc.groups.includes(selectedGroup)) {
            let g = studentDoc.groups.filter(obj => {
              return obj !== selectedGroup
            })
            studentDoc.groups = g
          } else {
            studentDoc.groups.push(selectedGroup)
          }
        } else {
          studentDoc.groups = [selectedGroup]
        }

        updateDoc(studentRef, {groups: studentDoc.groups});
      }
    })
  }
  
  return (
    <div>
      <h1>Student Groups (Work in Progress...)</h1>
      
      {/* <!-- Dropdown Trigger --> */}
      <div
        className='dropdown-trigger btn group-dropdown white cyan-text text-darken-2'
        data-target='option-dropdown'
      >
        {selectedGroup.length > 0 ? selectedGroup : "Select Group"}
        <span
          className="material-icons"
          style={{position: "relative", top: "0.45rem", margin: "0 0 -0.5rem 0.25rem"}}
        >
          expand_more
        </span>
      </div>

      {/* <!-- Dropdown Structure --> */}
      <ul id='option-dropdown' className='dropdown-content'>
        {groupOptions.map(option => {
          return (
            <li key={`dropdown-item-${option}`}><a
              href="#!"
              className={option === selectedGroup ? "bold" : ""}
              onClick={() => setSelectedGroup(option)}
            >
              {option}
            </a></li>)
        })}

        {/********** Unused Has Passport Group **********/}
        {/* <li className="divider" key="divider-0" tabIndex="-1" />

        <li key='dropdown-item-Has Passport'><a
          href="#!"
          className={"Has Passport" === selectedGroup ? "bold" : ""}
          onClick={() => setSelectedGroup("Has Passport")}
        >
          Has Passport
        </a></li>

        <li className="divider" key="divider-1" tabIndex="-1" /> */}

        <li><a href="#!" key="add-group">Add Group +</a></li>
      </ul>

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
              {student.name}
            </a>
          )
        })}
      </div>
    </div>
  )
}

export default StudentGroups
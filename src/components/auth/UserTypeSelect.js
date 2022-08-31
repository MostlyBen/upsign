import { useState, useEffect } from 'react'
import { getFirestore } from '@firebase/firestore';
import { doc, onSnapshot } from "firebase/firestore";
import { getAuth } from "@firebase/auth";
import { getSubdomain } from '../../utils';

import {
  setUserType,
  getTeacherRegisterAllowed,
  allowStudentRegister,
} from '../../services';

const UserTypeSelect = (props) => {
  const [teacherAllowed, setTeacherAllowed] = useState(false)

  const db = getFirestore()
  const user = props.user
  const schoolId = getSubdomain()

  const getTeacherAllowed = async () => {
    const teacherAllowed = await getTeacherRegisterAllowed(db)
    setTeacherAllowed(teacherAllowed)

  }

  useEffect(() => {
    getTeacherAllowed()
    
    const teacherRegRef = doc(db, "schools", schoolId, "config", "teacher_register")
    const unsubscribe = onSnapshot(teacherRegRef, (doc) => {
      const active = doc.data().active
      if (typeof active === "boolean") {
        setTeacherAllowed(active)
      }
    })

    return () => unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setType = async (type) => {
    const allow = await allowStudentRegister(db, user.email)

    if (allow) {
      await setUserType(db, user, type).then(() => {
        window.location.reload()
      })
    } else {
      getAuth().signOut()
      window.alert(`Please log in with the correct account`)
      // window.location.reload()
    }
  }

  return (
    <div>
      <h3 style={{textAlign: "center"}}>What's Your Role at the School?</h3>
      <div style={{display: "table", margin: "auto", marginTop: "3rem"}}>
      <button
        className="waves-effect waves-light btn-large"
        style={{marginRight: "3rem"}}
        onClick={async () => await setType("student")}
      >
        Student
      </button>
      <button
        className={`waves-effect waves-light btn-large ${teacherAllowed ? '' : 'disabled'}`}
        onClick={teacherAllowed ? () => setType("teacher") : () => console.log('Sorry, cannot register as a teacher at this time')}
      >
        Teacher
      </button>
      </div>
    </div>
  )
}

export default UserTypeSelect
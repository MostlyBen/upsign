import { useState, useEffect } from 'react'
import { getFirestore } from '@firebase/firestore';
import { doc, getDoc, onSnapshot } from "firebase/firestore";

import { setUserType } from '../../utils';

const UserTypeSelect = (props) => {
  const [teacherAllowed, setTeacherAllowed] = useState(false)

  const db = getFirestore()
  const user = props.user

  const teacherRegRef = doc(db, "config", "teacher_register")
  const getTeacherAllowed = async () => {
    getDoc(teacherRegRef).then(teacherRegSetting => {
      if (teacherRegSetting.exists()) {
        const active = teacherRegSetting.data().active
        if (typeof active === "boolean") {
          setTeacherAllowed(active)
        }
      }
    })
  }

  useEffect(() => {
    getTeacherAllowed()
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
    await setUserType(db, user, type).then(() => {
      window.location.reload()
    })
  }

  return (
    <div>
      <h3 style={{textAlign: "center"}}>What's Your Role at the School?</h3>
      <div style={{display: "table", margin: "auto", marginTop: "3rem"}}>
      <button
        className="waves-effect waves-light btn-large"
        style={{marginRight: "3rem"}}
        onClick={() => setType("student")}
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
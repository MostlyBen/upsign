import { useState, useEffect } from "react"
import { doc, collection, getDoc, setDoc } from "firebase/firestore";
import { getSubdomain } from '../../../utils';
import { LoadingBar } from "../../";

const Signups = (props) => {
  const [loading, setLoading] = useState(true)
  const [teacherReg, setTeacherReg] = useState(false)
  const [studentSign, setStudentSign] = useState(true)
  // const [teacherEdit, setTeacherEdit] = useState(true)
  const schoolId = getSubdomain

  const configRef = collection(props.db, "schools", schoolId, "config")
  const teacherRegRef = doc(props.db, "schools", schoolId, "config", "teacher_register")
  const studentSignRef = doc(props.db, "schools", schoolId, "config", "student_signup")

  const get_settings = async () => {
    getDoc(teacherRegRef)
      .then(teacherRegSetting => {
        if (teacherRegSetting.exists()) {
          const active = teacherRegSetting.data().active
          if (typeof active === "boolean") {
            setTeacherReg( active )
          }
        }
      })
      .then(() => {
        setLoading(false)
      })
    getDoc(studentSignRef)
      .then(studentSignSetting => {
        if (studentSignSetting.exists()) {
          const active = studentSignSetting.data().active
          if (typeof active === "boolean") {
            setStudentSign( active )
          }
        }
      })
  }

  useEffect(() => {
    get_settings() // Should probably do this with an onSnapshot, too
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSwitchTeacherReg = async () => {
    await setDoc(doc(configRef, "teacher_register"), {active: !teacherReg});
    setTeacherReg(!teacherReg);
  }

  const handleSwitchStudentSign = async () => {
    await setDoc(doc(configRef, "student_signup"), {active: !studentSign});
    setStudentSign(!studentSign);
  }

  if (loading) {
    return <LoadingBar />
  }

  return (
    <div className="menu-card">
      <h1>
        SignUp Settings
      </h1>

      {loading
        ? <LoadingBar />
        : <div />
      }
      <div className="switches">
        {/* Student SignUps */}
        <div className="switch toggle-switch">
          <label>
            <input type="checkbox" checked={!!teacherReg} onClick={handleSwitchTeacherReg} />
            <span class="lever"></span>
          </label>
          New users can register as teachers
        </div>

        {/* Student SignUps */}
        <div className="switch toggle-switch">
          <label>
            <input type="checkbox" checked={!!studentSign} onClick={handleSwitchStudentSign} />
            <span class="lever"></span>
          </label>
          Students can sign up
        </div>

        {/* Teacher Edits */}
        <div className="switch toggle-switch">
          <label>
            <input type="checkbox" />
            <span class="lever"></span>
          </label>
          Teachers can edit sessions (NOT YET PROGRAMMED)
        </div>
      </div>
    </div>
  )
}

export default Signups
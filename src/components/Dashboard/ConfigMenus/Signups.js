import { useState, useEffect } from "react"
import { doc, collection, getDoc, setDoc } from "firebase/firestore";

const Signups = (props) => {
  const [loading, setLoading] = useState(true)
  const [teacherReg, setTeacherReg] = useState(false)
  // const [studentSign, setStudentSign] = useState(true)
  // const [teacherEdit, setTeacherEdit] = useState(true)

  const configRef = collection(props.db, "config")
  const teacherRegRef = doc(props.db, "config", "teacher_register")

  const get_settings = async () => {
    getDoc(teacherRegRef).then(teacherRegSetting => {
      if (teacherRegSetting.exists()) {
        if (typeof teacherRegSetting.data().active === "boolean") {
          setTeacherReg( teacherRegSetting.data().active )
        }
      }
    }).then(() => {
      setLoading(false)
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

  if (loading) {
    return (
      <div>
        <div className="progress">
          <div className="indeterminate"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="menu-card">
      <h1>
        SignUp Settings
      </h1>

      {loading
        ? <div className="progress indeterminate" />
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
            <input type="checkbox" />
            <span class="lever"></span>
          </label>
          Students can sign up (NOT YET PROGRAMMED)
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
import { useState, useEffect } from "react"
import {
  getTeacherRegisterAllowed,
  getSignupAllowed,
  setTeacherRegisterAllowed,
  setSignupAllowed,
} from '../../../services'
import { LoadingBar } from "../../";

const Signups = ({ db }) => {
  const [loading, setLoading] = useState(true)
  const [teacherReg, setTeacherReg] = useState(false)
  const [studentSign, setStudentSign] = useState(true)
  // const [teacherEdit, setTeacherEdit] = useState(true)

  const updateSettings = async () => {
    const teacherRegSetting = await getTeacherRegisterAllowed(db)
    const studentSignupSetting = await getSignupAllowed(db)
    setTeacherReg(teacherRegSetting)
    setStudentSign(studentSignupSetting)
    setLoading(false)
  }

  useEffect(() => {
    updateSettings() // Should probably do this with an onSnapshot, too
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSwitchTeacherReg = async () => {
    await setTeacherRegisterAllowed(db, {active: !teacherReg});
    setTeacherReg(!teacherReg);
  }

  const handleSwitchStudentSign = async () => {
    await setSignupAllowed(db, {active: !studentSign});
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
            <input type="checkbox" checked={!!teacherReg} readOnly={true} onClick={handleSwitchTeacherReg} />
            <span className="lever"></span>
          </label>
          New users can register as teachers
        </div>

        {/* Student SignUps */}
        <div className="switch toggle-switch">
          <label>
            <input type="checkbox" checked={!!studentSign} readOnly={true} onClick={handleSwitchStudentSign} />
            <span className="lever"></span>
          </label>
          Students can sign up
        </div>

      </div>
    </div>
  )
}

export default Signups
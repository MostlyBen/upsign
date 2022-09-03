import { useState, useEffect } from "react"
import {
  getSignupAllowed,
  setSignupAllowed,
} from '../../../services'
import { LoadingBar } from "../../";

const Signups = ({ db }) => {
  const [loading, setLoading] = useState(true)
  const [studentSign, setStudentSign] = useState(true)
  // const [teacherEdit, setTeacherEdit] = useState(true)

  const updateSettings = async () => {
    const studentSignupSetting = await getSignupAllowed(db)
    setStudentSign(studentSignupSetting)
    setLoading(false)
  }

  useEffect(() => {
    updateSettings()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
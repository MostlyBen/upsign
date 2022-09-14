import { useState, useEffect } from "react"
import {
  getDomainRestriction,
  setDomainRestriction,
  getTeacherRegisterAllowed,
  setTeacherRegisterAllowed,
} from "../../../services";
import { LoadingBar } from "../../"

const Registrations = ({ db }) => {
  const [loading, setLoading] = useState(true)
  const [teacherReg, setTeacherReg] = useState(false)
  const [restrictDomain, setRestrictDomain] = useState(false)
  const [domain, setDomain] = useState('')
  // const [teacherEdit, setTeacherEdit] = useState(true)

  const updateSettings = async (db) => {
    const domainResSettings = await getDomainRestriction(db)
    setRestrictDomain( domainResSettings.active )
    setDomain( domainResSettings.domain )

    const teacherRegSetting = await getTeacherRegisterAllowed(db)
    setTeacherReg(teacherRegSetting)
    setLoading(false)
  }

  const handleSwitchTeacherReg = async () => {
    await setTeacherRegisterAllowed(db, {active: !teacherReg});
    setTeacherReg(!teacherReg);
  }

  useEffect(() => {
    updateSettings(db)
  }, [db])


  const handleSwitchRestrictDomain = async () => {
    setRestrictDomain(!restrictDomain);
    await setDomainRestriction(db, {active: !restrictDomain, domain: domain});
  }

  const handleUpdateDomain = async (e) => {
    setDomain(e.target.value)
    await setDomainRestriction(db, {active: restrictDomain, domain: e.target.value})
  }

  if (loading) {
    return <LoadingBar />
  }

  return (
    <div className="menu-card">
      <h1>
        Registration Settings
      </h1>

      {loading
        ? <LoadingBar />
        : <div />
      }
      <div className="switches">
        {/* Teacher Registrations */}
        <div className="switch toggle-switch">
          <label>
            <input type="checkbox" checked={!!teacherReg} readOnly={true} onClick={handleSwitchTeacherReg} />
            <span className="lever"></span>
          </label>
          New users can register as teachers
        </div>

        {/* Student Registrations */}
        <div className="switch toggle-switch">
          <label>
            <input type="checkbox" checked={!!restrictDomain} onChange={handleSwitchRestrictDomain} />
            <span className="lever"></span>
          </label>
          Restrict new students to this domain:
        </div>

        {/* Domain */}
        <div className="input-field col s12">
          <input value={domain} id="domain" type = "text" onChange={(e) => handleUpdateDomain(e)} />
          <label className="active" htmlFor="domain">Domain</label>
        </div>

      </div>

    </div>
  )
}

export default Registrations
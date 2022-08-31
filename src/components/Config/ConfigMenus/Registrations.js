import { useState, useEffect } from "react"
import { getDomainRestriction, setDomainRestriction } from "../../../services";
import { LoadingBar } from "../../"

const Registrations = ({ db }) => {
  const [loading, setLoading] = useState(true)
  const [restrictDomain, setRestrictDomain] = useState(false)
  const [domain, setDomain] = useState('')
  // const [teacherEdit, setTeacherEdit] = useState(true)

  const updateSettings = async (db) => {
    await getDomainRestriction(db)
      .then(r => {
        setRestrictDomain( r.active )
        setDomain( r.domain )
      })
      .then(() => {
        setLoading(false)
      })

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

      {/* Domain */}
      <div className="input-field col s12">
        <input value={domain} id="domain" type = "text" onChange={(e) => handleUpdateDomain(e)} />
        <label className="active" htmlFor="domain">Domain</label>
      </div>

      {/* Student SignUps */}
      <div className="switch toggle-switch">
          <label>
            <input type="checkbox" checked={!!restrictDomain} onChange={handleSwitchRestrictDomain} />
            <span className="lever"></span>
          </label>
          Restrict new students to this domain
        </div>
      </div>

    </div>
  )
}

export default Registrations
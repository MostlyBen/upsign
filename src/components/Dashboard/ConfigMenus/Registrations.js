import { useState, useEffect } from "react"
import { doc, collection, getDoc, setDoc } from "firebase/firestore";

const Registrations = (props) => {
  const [loading, setLoading] = useState(true)
  const [restrictDomain, setRestrictDomain] = useState(false)
  const [domain, setDomain] = useState('')
  // const [teacherEdit, setTeacherEdit] = useState(true)

  const configRef = collection(props.db, "config")
  const restrictDomainRef = doc(props.db, "config", "domain_restriction")

  const get_settings = async () => {
    getDoc(restrictDomainRef)
      .then(restrictDomainSetting => {
        if (restrictDomainSetting.exists()) {
          const active = restrictDomainSetting.data().active
          if (typeof active === "boolean") {
            setRestrictDomain( active )
            setDomain( restrictDomainSetting.data().domain )
          }
        }
      })
      .then(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    get_settings() // Should probably do this with an onSnapshot, too
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const handleSwitchRestrictDomain = async () => {
    await setDoc(doc(configRef, "domain_restriction"), {active: !restrictDomain, domain: domain});
    setRestrictDomain(!restrictDomain);
  }

  const handleUpdateDomain = async (e) => {
    setDomain(e.target.value)

    await setDoc(doc(configRef, "domain_restriction"), {active: restrictDomain, domain: e.target.value})
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
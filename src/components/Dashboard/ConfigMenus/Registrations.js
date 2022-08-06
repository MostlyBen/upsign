import { useState, useEffect } from "react"
import { doc, collection, getDoc, setDoc } from "firebase/firestore";
import { schoolId } from "../../../config";
import { LoadingBar } from "../../"

const Registrations = (props) => {
  const [loading, setLoading] = useState(true)
  const [restrictDomain, setRestrictDomain] = useState(false)
  const [domain, setDomain] = useState('')
  // const [teacherEdit, setTeacherEdit] = useState(true)

  const configRef = collection(props.db, "schools", schoolId, "config")
  const restrictDomainRef = doc(props.db, "schools", schoolId, "config", "domain_restriction")

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
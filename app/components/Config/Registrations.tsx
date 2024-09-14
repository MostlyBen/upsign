import { Firestore } from "firebase/firestore";
import { useState, useEffect } from "react"
import {
  getDomainRestriction,
  setDomainRestriction,
  getTeacherRegisterAllowed,
  setTeacherRegisterAllowed,
} from "~/services";

type RegistrationProps = {
  db: Firestore,
}
const Registrations = ({ db }: RegistrationProps) => {
  const [loading, setLoading] = useState(true);
  const [teacherReg, setTeacherReg] = useState(false);
  const [restrictDomain, setRestrictDomain] = useState(false);
  const [domain, setDomain] = useState('');

  const updateSettings = async (db: Firestore) => {
    const domainResSettings = await getDomainRestriction(db);
    setRestrictDomain(domainResSettings.active);
    setDomain(domainResSettings.domain);

    const teacherRegSetting = await getTeacherRegisterAllowed(db);
    setTeacherReg(teacherRegSetting);
    setLoading(false);
  }

  const handleSwitchTeacherReg = async () => {
    await setTeacherRegisterAllowed(db, { active: !teacherReg });
    setTeacherReg(!teacherReg);
  }

  useEffect(() => {
    updateSettings(db);
  }, [db]);


  const handleSwitchRestrictDomain = async () => {
    setRestrictDomain(!restrictDomain);
    await setDomainRestriction(db, { active: !restrictDomain, domain });
  }

  const handleUpdateDomain = async (domain: string) => {
    setDomain(domain);
    await setDomainRestriction(db, { active: restrictDomain, domain });
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="prose">
      <h1>
        Registration Settings
      </h1>

      <hr className="my-4" />

      {loading
        ? <div>Loading...</div>
        : <div />
      }
      <div className="switches">
        {/* Teacher Registrations */}
        <div className="flex flex-row gap-4 my-4">
          <input className="toggle toggle-primary" type="checkbox" checked={!!teacherReg} readOnly onClick={handleSwitchTeacherReg} />
          <label style={{ transform: "translateY(-2px)" }}>
            New users can register as teachers
          </label>
        </div>

        {/* Student Registrations */}
        <div className="flex flex-row gap-4 mt-4 mb-2">
          <input className="toggle toggle-primary" type="checkbox" checked={!!restrictDomain} onChange={handleSwitchRestrictDomain} />
          <label>
            Restrict new students to this domain:
          </label>
        </div>

        {/* Domain */}
        <div className="input-field col s12">
          <input
            className="input input-bordered w-full"
            value={domain}
            id="domain"
            type="text"
            placeholder="gmail.com"
            onChange={(e) => handleUpdateDomain(e.target.value)}
          />
        </div>

      </div>

    </div>
  )
}

export default Registrations

import { Link, Navigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react"
import {
  General,
  StudentGroups,
  Registrations,
  EditGroups,
  // NewYear,
  People,
  ScheduleConfig,
} from './ConfigMenus'

const Config = ({ db }) => {
  const params = useParams()
  const initialMenu = params.menu

  const [menu, setMenu] = useState(initialMenu ?? 'general') // Signups switch not working, for some reason

  useEffect(() => {
    setMenu(initialMenu)
  }, [initialMenu])

  if (!initialMenu) {
    return <Navigate to="/config/general" />
  }

  const menuObject = {
    general: <General db={db} />,
    registrations: <Registrations db={db} />,
    schedule: <ScheduleConfig db={db} />,
    people: <People db={db} />,
    groups: <StudentGroups db={db} />,
    editgroups: <EditGroups db={db} />,
    newyear: <div>Dev use only</div>, // <NewYear db={db} />,
  }
  
  return (
    <div className="row" style={{marginTop: "5rem"}}>
      <div className="col s12 m4 l3 menu-selector" style={{paddingTop: '3rem'}}>
        <Link to="/config/general" className={`menu-btn waves-effect ${menu === 'general' ? 'active' : ''}`}>
          General
        </Link>

        <Link to="/config/registrations" className={`menu-btn waves-effect ${menu === 'registrations' ? 'active' : ''}`}>
          Registrations
        </Link>

        <hr />

        <Link to="/config/schedule" className={`menu-btn waves-effect ${menu === 'schedule' ? 'active' : ''}`}>
          Schedule
        </Link>

        <hr />
        <Link to="/config/people" className={`menu-btn waves-effect ${menu === 'people' ? 'active' : ''}`}>
          People
        </Link>

        <hr />
        <Link to="/config/groups" className={`menu-btn waves-effect ${menu === 'groups' ? 'active' : ''}`}>
          Group Students
        </Link>

        <Link to="/config/editgroups" className={`menu-btn waves-effect ${menu === 'editgroups' ? 'active' : ''}`}>
          Edit Groups
        </Link>
      </div>
      <div className="col s12 m8 l9 card menu-card" style={{height: '75vh', padding: '3rem', overflowY: "auto"}}>
        { menuObject[menu] }
      </div>
    </div>
  )
}

export default Config
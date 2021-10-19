import { Link, Redirect } from "react-router-dom";
import { useState, useEffect } from "react"
import { Signups, StudentGroups } from './ConfigMenus'

const Config = (props) => {
  const [menu, setMenu] = useState(props.match.params.menu ?? 'signups') // Signups switch not working, for some reason

  useEffect(() => {
    setMenu(props.match.params.menu)
  }, [props.match.params.menu])

  if (!menu) {
    return <Redirect to="/config/signups" />
  }

  const menuObject = {
    signups: <Signups db={props.db} />,
    groups: <StudentGroups db={props.db} />,
  }
  
  return (
    <div className="row" style={{marginTop: "5rem"}}>
      <div className="col s12 m4 l3 menu-selector" style={{paddingTop: '3rem'}}>
        <Link to="/config/signups" className={`menu-btn waves-effect ${menu === 'signups' ? 'active' : ''}`}>
          SignUps
        </Link>

        <Link to="/config/groups" className={`menu-btn ${menu === 'groups' ? 'active' : ''}`}>
          Student Groups
        </Link>
      </div>
      <div className="col s12 m8 l9 card menu-card" style={{height: '75vh', padding: '3rem'}}>
        { menuObject[menu] }
      </div>
    </div>
  )
}

export default Config
import { useContext, useState } from 'react';
import { Link } from "react-router-dom";

import { SignOut } from "../";
import { ThemeContext } from '../../contexts';
import logo from '../../img/logo192.png';

const NavBarMenu = ({show}) => {
  const { theme, setTheme } = useContext(ThemeContext);

  const handleThemeChange = () => {
    const isCurrentDark = theme === 'dark';
    setTheme(isCurrentDark ? 'light' : 'dark');
    localStorage.setItem('default-theme', (isCurrentDark ? 'light' : 'dark') );
  };

  return (
    <div className={`floating-menu scale-transition ${show ? 'scale-in': 'scale-out'}`}>
      <div>
        <div className="switch toggle-switch" style={{margin: "0", paddingRight: "1.5rem"}}>
          <label>
            <input type="checkbox" defaultChecked={theme === 'dark'} onClick={handleThemeChange} />
            <span className="lever"></span>
          </label>
          Dark Mode
        </div>
      </div>
      <hr />
      <div style={{minHeight: "0px !important"}}>
        <SignOut />
      </div>
    </div>
  )
}

const TeacherLinks = (props) => {
  const [showLogoMenu, setShowLogoMenu] = useState(false)

  const clickOffListener = (e) => {
    if ( !document.getElementById('logo-menu-clickbox').contains(e.target) && showLogoMenu ) {
      setShowLogoMenu(false)
    }
  }

  window.addEventListener('click', clickOffListener)

  const handleClickShow = () => {
    setShowLogoMenu(!showLogoMenu)
  }



  return (
    <div>
      <div id="logo-menu-clickbox" style={{display: "inline-block"}}>
        <div className="logo-menu-btn" onClick={handleClickShow}>
          <img
            src={logo}
            height="40"
            alt="logo"
            style={{
              position: "relative",
              verticalAlign: "middle",
              top: "-4px",
            }}
          />
          <span
            className="material-icons"
            style={{position: "relative", top: "0.45rem", margin: "0"}}
          >
            expand_more
          </span>
        </div>
        
        <NavBarMenu show={showLogoMenu} />
      </div>

      <Link
        to="/"
        className="navbar-link"
      >
        Home
      </Link>

      <Link
        to="/overview"
        className="navbar-link"
      >
        All Sessions
      </Link>
    </div>
  )
}

const StudentLinks = ({ schoolName }) => {

  return (
    <div>
      <div
        className="navbar-link"
        style={{whiteSpace: "nowrap"}}
      >
        <img
          src={logo}
          height="40"
          alt="logo"
          style={{
            paddingRight: "1.5rem",
            position: "relative",
            verticalAlign: "middle",
            top: "-4px",
          }}
        />
        <span className="hide-on-small" style={{whiteSpace: "nowrap"}}>{schoolName}</span>
      </div>
    </div>
  )
}

const NavBar = ({ userType, match, schoolName }) => {
  return (
    <div className="navbar-fixed">
      <nav>
        <div className="nav-wrapper valign-wrapper">
          {userType === "teacher" ? <TeacherLinks match={match} /> : <StudentLinks schoolName={schoolName} />}
          {/* <SignOut style={{position: "absolute", right: "2rem"}} /> */}
        </div>
      </nav>
    </div>
  )
}

export default NavBar
import { useContext } from 'react';
import { Link } from "react-router-dom";
// import { useNavigate } from "react-router";

import { SignOut } from "../"
import { ThemeContext } from '../../contexts';
import logo from '../../img/logo192.png'

const TeacherLinks = (props) => {
  return (
    <div>
      <Link
        to="/"
        className="navbar-link"
      >
        <img
          src={logo}
          height="40"
          alt="logo"
          style={{
            paddingRight: "1.5rem",
            position: "relative",
            verticalAlign: "middle",
            top: "-4px"
          }}
        />
        Home
      </Link>

      <Link
        to="/overview"
        // onClick={() => navigate('/overview')}
        className="navbar-link"
      >
        All Sessions
      </Link>
    </div>
  )
}

const StudentLinks = ({ schoolName }) => {
  // const navigate = useNavigate()

  return (
    <div>
      <div
        // onClick = {() => navigate('/')}
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
  const { theme, setTheme } = useContext(ThemeContext);

  const handleThemeChange = () => {
    const isCurrentDark = theme === 'dark';
    setTheme(isCurrentDark ? 'light' : 'dark');
    localStorage.setItem('theme', isCurrentDark ? 'light' : 'dark');
  };

  return (
    <div className="navbar-fixed">
      <nav>
        <div className="nav-wrapper valign-wrapper">
          {/* <button onClick={handleThemeChange}>Switch</button> */}

          {userType === "teacher" ? <TeacherLinks match={match} /> : <StudentLinks schoolName={schoolName} />}
          <SignOut style={{position: "absolute", right: "2rem"}} />
        </div>
      </nav>
    </div>
  )
}

export default NavBar
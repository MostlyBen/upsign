import { Link } from "react-router-dom";
import { SignOut } from "../"
import { withRouter } from "react-router";

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
        className="navbar-link"
      >
        All Sessions
      </Link>
    </div>
  )
}

const NavBar = ({ userType, match }) => {
  return (
    <div className="navbar-fixed">
      <nav>
        <div className="nav-wrapper white valign-wrapper">
          {userType === "teacher" ? <TeacherLinks match={match} /> : <div />}
          <SignOut style={{position: "absolute", right: "2rem"}} />
        </div>
      </nav>
    </div>
  )
}

export default withRouter(NavBar)
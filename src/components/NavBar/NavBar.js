import { SignOut } from ".."

const NavBar = (props) => {
  return (
    <div className="navbar-fixed">
      <nav>
        <div className="nav-wrapper white valign-wrapper">
          <SignOut style={{position: "absolute", right: "2rem"}} />
        </div>
      </nav>
    </div>
  )
}

export default NavBar
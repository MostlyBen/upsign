import { getAuth } from "@firebase/auth";

const SignOut = (props) => {
  return (
    <button
      className="btn btn-flat waves-effect surface grey-text"
      onClick={() => {getAuth().signOut(); window.location.reload()}}
      style={props.style}
    >
      Log Out
    </button>
  )
}

export default SignOut
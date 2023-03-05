import { getAuth } from "@firebase/auth";

const SignOut = (props) => {
  return (
    <button
      className="btn btn-flat waves-effect surface grey-text"
      onClick={() => {getAuth().signOut(); window.location.reload()}}
      style={{height: '3rem', margin: 'auto', ...props.style}}
    >
      Log Out
    </button>
  )
}

export default SignOut
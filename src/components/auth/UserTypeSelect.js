import { getFirestore } from '@firebase/firestore';

import { setUserType } from '../../utils';

const UserTypeSelect = (props) => {
  const db = getFirestore()
  const user = props.user

  const setType = async (type) => {
    await setUserType(db, user, type).then(() => {
      window.location.reload()
    })
  }

  return (
    <div>
      <h3 style={{textAlign: "center"}}>What's Your Role at the School?</h3>
      <div style={{display: "table", margin: "auto", marginTop: "3rem"}}>
      <button
        className="waves-effect waves-light btn-large"
        style={{marginRight: "3rem"}}
        onClick={() => setType("student")}
      >
        Student
      </button>
      <button
        className="waves-effect waves-light btn-large"
        onClick={() => setType("teacher")}
      >
        Teacher
      </button>
      </div>
    </div>
  )
}

export default UserTypeSelect
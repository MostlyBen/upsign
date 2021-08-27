import './App.css';

import { useState, useEffect } from 'react';

import { getFirestore } from '@firebase/firestore';
import { initializeApp } from '@firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from '@firebase/auth';

import {
  UserTypeSelect,
  NavBar,
  TeacherSignUp,
  StudentSignUp,
} from './components'

import { getUserType } from './utils'

import config from './config'

initializeApp(config)

function App() {
  const provider = new GoogleAuthProvider();

  const auth = getAuth();
  auth.languageCode = 'en';

  const [user, setUser] = useState(auth.currentUser)
  const [userType, setUserTypeState] = useState()

  auth.onAuthStateChanged((response) => {
    setUser(response)
  })

  const db = getFirestore();

  const handleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // Gives a Google Access Token. Can be used to access Google API
        // eslint-disable-next-line no-unused-vars
        const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;
        // const user = result.user;
      }).catch((error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = GoogleAuthProvider.credentialFromError(error);

        console.log("Error:")
        console.log(errorCode, errorMessage, email, credential)
      }))
  }

  const findUserType = async (db, user) => {
    await getUserType(db, user)
      .then(userDoc => {
        if (userDoc) {
          if (userDoc.exists()) {
            console.log("User has a role")
            setUserTypeState(userDoc.data().type)
          } else {
            console.log("User does not have a role")
            setUserTypeState("unset")
          }
        }
      })
  }

  useEffect(() => {
    console.log("Updating user type")
    findUserType(db, user)
  }, [db, user])

  if (!user) {
    return (
      <div className="App">
        <div className="container">
          <h3 style={{textAlign: "center"}}>Please Log In</h3>
          <button
            className='waves-effect waves-light btn-large'
            onClick={() => handleSignIn()}
            style={{display: "table", margin: "auto"}}
          >
            Sign in with Google
          </button>
        </div>
      </div>
    )
  } else if (user && userType === 'unset') {
    return (
      <UserTypeSelect db={db} user={user} />
    )
  } else if (user && userType !== 'unset') {
    return (
      <div className="App">
        <NavBar user={user} />
        <div className="container" >
  
          <h3 style={{textAlign: "center"}}>
            <div>Hey there, <b>{user.displayName.split(' ')[0]}</b></div>
          </h3>
  
          <div className="main-content">
            {userType === 'teacher' ? <TeacherSignUp db={db} user={user} /> : null}
            {userType === 'student' ? <StudentSignUp db={db} /> : null}
          </div>
        </div>
      </div>
    );
  } else {
    return <div />
  }
}



export default App;

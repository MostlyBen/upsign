import './App.css';

import { useState, useEffect } from 'react';

import { getFirestore } from '@firebase/firestore';
import { initializeApp } from '@firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from '@firebase/auth';

import {
  TeacherRouter,
  StudentRouter,
} from './routers'

import {
  UserTypeSelect,
  NavBar,
} from './components';

import { getUserType } from './utils';

import { firebaseConfig } from './config';

initializeApp(firebaseConfig)

function App() {

  // Firebase & Auth-Related Vars
  const provider = new GoogleAuthProvider();
  const db = getFirestore();
  const auth = getAuth();
  auth.languageCode = 'en';

  // State
  const [user, setUser] = useState(auth.currentUser);
  const [userType, setUserTypeState] = useState();

  // Hook to set user once logged in
  // Used to be in handleSignIn, but React wasn't re-rendering
  auth.onAuthStateChanged((response) => {
    setUser(response)
  });

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

  // Get user type & update state
  const updateUserTypeState = async (db, user) => {
    await getUserType(db, user)
      .then(userDoc => {
        if (userDoc) {
          if (userDoc.exists()) {
            setUserTypeState(userDoc.data().type)
          } else {
            setUserTypeState("unset")
          }
        }
      })
  }

  // Hook to update user type state when user is updated
  useEffect(() => {
    updateUserTypeState(db, user)
  }, [db, user]);


  // Sign In Page
  if (!user) {
    return (
      <div className="App">
        <div className="container" style={{marginTop: "33vh", maxWidth: "60vw", display: "table", textAlign: "center"}}>
          <div>
            <h3>Please Log In</h3>
            <button
              className='login-with-google-btn'
              onClick={() => handleSignIn()}
              style={{display: "table", margin: "auto"}}
            >
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    );

  // User Type Selection
  } else if (user && userType === 'unset') {
    return (
      <div className="App">
        <UserTypeSelect db={db} user={user} />
      </div>
    );
    
  // Main App
  } else if (user && userType !== 'unset') {
    return (
      <div className="App">
        <NavBar user={user} />
        <div className="container" >
          <div className="main-content">
            {userType === 'teacher' ? <TeacherRouter db={db} user={user} /> : null}
            {userType === 'student' ? <StudentRouter db={db} user={user} /> : null}
          </div>
        </div>
      </div>
    );
  } else {
    return <div />
  }
}


export default App;

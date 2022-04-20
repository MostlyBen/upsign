import './App.scss';

import { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { getFirestore } from '@firebase/firestore';
import { initializeApp } from '@firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from '@firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth'

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
  const [user, loading] = useAuthState(auth)


  // State
  const [userType, setUserTypeState] = useState();
  const [userNickname, setUserNickname] = useState(false)
  const [loadingNickname, setLoadingNickname] = useState(true)

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
            const data = userDoc.data()
            setUserTypeState(data.type)

            /* Check for a nickname */
            if (data.hasOwnProperty('nickname')) {
              setUserNickname(data.nickname)
            }
            
            return true
          } else {
            setUserTypeState("unset")
            return true
          }
        }
      }).then ( complete => {
        if (complete) {
          setLoadingNickname(false)
        }
      })
  }

  // Hook to update user type state when user is updated
  useEffect(() => {
    if (auth.currentUser) {
      updateUserTypeState(db, user)
    }
  }, [db, auth, user]);


  // Sign In Page
  if (!auth.currentUser && !loading) {
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
  } else if (auth.currentUser && userType === 'unset' && !loading) {
    return (
      <div className="App">
        <UserTypeSelect db={db} user={user} />
      </div>
    );
    
  // Main App
  } else if (auth.currentUser && userType !== 'unset' && !loading && !loadingNickname) {
    /* Update the user object if a nickname was found */
    let u = user
    if (userNickname) {
      u = {nickname: userNickname, ...user}
    }

    return (
      <div className="App">
        <Router>
        <NavBar user={user} userType={userType} />
          <div className="body-container">
            <div className="container">
              <div className="main-content">
                {userType === 'teacher' ? <TeacherRouter db={db} user={u} /> : null}
                {userType === 'student' ? <StudentRouter db={db} user={u} /> : null}
              </div>
            </div>
          </div>
        </Router>
      </div>
    );
  } else {
    return (
      <div className="progress grey lighten-5" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
      }}>
          <div className="indeterminate grey lighten-3"></div>
      </div>
    )
  }
}


export default App;

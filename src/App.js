import './styles/App.scss';

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
  LoadingBar,
  CircularLoading,
} from './components';

import { getUserType, getSchoolName } from './services';

import { ThemeContext } from './contexts'

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
  const [schoolName, setSchoolName] = useState("")
  const [schoolNameLoading, setSchoolNameLoading] = useState(true)

  // Detecting the default theme
  const isBrowserDefaultDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches;
  const getDefaultTheme = () => {
    const localStorageTheme = localStorage.getItem('default-theme');
    const browserDefault = isBrowserDefaultDark() ? 'dark' : 'light';
    return localStorageTheme || browserDefault;
  };
  const [theme, setTheme] = useState(getDefaultTheme());


  const updateSchoolName = async () => {
    const name = await getSchoolName(db)
    setSchoolName(name)
    setSchoolNameLoading(false)
  }

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

  // Get the school's name on load
  useEffect(() => {
    updateSchoolName()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db])

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
        <div className="container" style={{marginTop: "30vh", maxWidth: "60vw", display: "table", textAlign: "center"}}>
          <div>
            <h3 style={{width: "100vw", marginBottom: "2rem"}}>
              UpSign for
              {!schoolNameLoading
               ? <span style={{fontWeight: "550", color: "#252525"}}>{` ${schoolName}`}</span>
               : <CircularLoading />}
            </h3>
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
        <ThemeContext.Provider value={{ theme, setTheme }}>
        <div className={`theme-${theme}`}>

        <Router>
        <NavBar user={user} userType={userType} schoolName={schoolName} />
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
        </ThemeContext.Provider>
      </div>
    );
  } else {
    return <LoadingBar />
  }
}


export default App;

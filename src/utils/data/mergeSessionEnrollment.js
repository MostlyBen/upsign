const mergeSessionEnrollment = (sessions, enrollment) => { 
  var sessionsCopy = sessions
  var enrollmentObj = {}

  // Assemble an object of enrollments keyed by session_id
  for (const i in enrollment) {
    const e = enrollment[i]
    if (Array.isArray(enrollmentObj[e.session_id])) {
      enrollmentObj[e.session_id].push(e)
    } else {
      enrollmentObj[e.session_id] = [e]
    }
  }

  // Put enrollments into the session object in the array
  for (const i in sessionsCopy) {
    const sessionId = sessionsCopy[i].id
    const sessionEnr = enrollmentObj[sessionId]
    if ( Array.isArray(sessionEnr) ) {
      sessionsCopy[i].enrollment = sessionEnr
    } else {
      sessionsCopy[i].enrollment = []
    }
  }

  return sessionsCopy

}

export default mergeSessionEnrollment
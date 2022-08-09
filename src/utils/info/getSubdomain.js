// DEFAULTS TO MUSEUM. SHOULD CHANGE THIS SOON
const getSubdomain = () => {
  const host = window.location.host;
  // Make this work on localhost
  if ( host.includes("localhost") ) {
    const arr = host
    // Regex to select periods and colons
    .split(/[.:]/)
    var i = arr.indexOf("localhost")
    return i > 0 ? arr.slice(0, i)[0] : 'museum'
  
  // Make this work online
  } else if ( host.includes("upsign") ) {
    const arr = host
    .split(".")
    .splice(0, host.includes("upsign") ? -1 : -2);

    return i > 0 ? arr.slice(0, i) : 'museum'

  } else {
    return null
  }

}

export default getSubdomain
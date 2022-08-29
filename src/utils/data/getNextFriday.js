
const getNextFriday = () => {
  // Check if it's Friday
  const d = new Date()
  // eslint-disable-next-line no-unused-vars
  let day = d.getDay()
  // Hot fix to show current day
  if (true /*day === 5*/ ) {
    return d

  // Find and return the next Friday
  } else {
    const dateCopy = new Date(d.getTime())
    const nextFriday = new Date(
      dateCopy.setDate(
        dateCopy.getDate() + ((7 - dateCopy.getDay() + 5) % 7 || 7)
      )
    )
  
    return nextFriday
  }

}

export default getNextFriday
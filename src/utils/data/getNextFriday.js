
const getNextFriday = () => {
  // Check if it's Friday
  const d = new Date()
  let day = d.getDay()
  if (day === 5) {
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
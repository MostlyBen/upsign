const numberToArrayOfStrings = (n) => {
  let arr = []

  for (let i = 0; i < n; i++) {
    arr.push(String(i+1))
  }

  return arr
}

export default numberToArrayOfStrings
function buildThresholdList() {
  const thresholds = [];
  const numSteps = 100;

  for (let i = 1.0; i <= numSteps; i++) {
    const ratio = i / numSteps;
    thresholds.push(ratio);
  }

  thresholds.push(0);
  return thresholds;
}

export default buildThresholdList

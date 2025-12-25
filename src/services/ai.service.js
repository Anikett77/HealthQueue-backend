async function predictWaitingTime(queueNumber) {
  return queueNumber * 5; // 5 min per patient (baseline AI logic)
}

module.exports = { predictWaitingTime };

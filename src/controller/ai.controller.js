const { predictWaitingTime } = require('../services/ai.service');

exports.getPrediction = async (req, res) => {
  try {
    const { queueNumber } = req.body;
    
    if (queueNumber === undefined) {
      return res.status(400).json({ message: "queueNumber is required" });
    }

    const predictedTime = await predictWaitingTime(queueNumber);
    
    res.json({
      queueNumber,
      predictedWaitingTime: predictedTime
    });
  } catch (err) {
    console.error("Error getting prediction:", err);
    res.status(500).json({ message: "Server error" });
  }
};


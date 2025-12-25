const router = require('express').Router();
const { getPrediction } = require('../controller/ai.controller');

router.post('/predict', getPrediction);

module.exports = router;

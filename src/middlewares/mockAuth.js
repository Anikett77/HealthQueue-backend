module.exports = (req, res, next) => {
  req.user = { id: "PAT123", role: "patient" };
  next();
};

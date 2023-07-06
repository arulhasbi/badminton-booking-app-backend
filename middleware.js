function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).json({ message: "An error occurred" });
}

module.exports = { errorHandler };

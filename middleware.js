const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.sendStatus(401); // If there's no token, respond with 401 (Unauthorized)
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // If token is invalid, respond with 403 (Forbidden)
    req.user = user; // Set the user information for subsequent middleware/functions
    next(); // Continue to the next middleware/function
  });
}

function errorHandler(err, req, res, next) {
  if (process.env.NODE_ENV === "development") {
    return res.status(500).json({ message: err.message });
  }
  return res.status(500).json({ message: "Internal server error" });
}

module.exports = { errorHandler, authenticateToken };

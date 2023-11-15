const { logError } = require("./errorLog");

// Middleware to handle errors and respond with a generic error message
exports.handleError = (err, req, res, next) => {
  console.error(err);

  // Log the error to your error logger
  logError(err);

  // Respond with an error status and message
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

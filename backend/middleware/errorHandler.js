const errorHandler = (
  err,
  req,
  res,
  next
) => {
  console.error(
    "Server Error:",
    err.message
  );

  if (res.headersSent) {
    return next(err);
  }

  const statusCode =
    err.statusCode ||
    err.status ||
    500;

  res.status(statusCode).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message || "Internal server error"
  });
};

module.exports = errorHandler;
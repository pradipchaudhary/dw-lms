// Error Handling Middleware
const errorHandler = (err, req, res, next) => {
    // Step 1: Log the error (optional, useful for debugging)
    console.error(err.stack);

    // Step 2: Set the status code, defaulting to 500 if not already set
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    // Step 3: Send a JSON response with the error message
    res.status(statusCode).json({
        success: false,
        message: err.message || "An unexpected error occurred",
    });
};

export default errorHandler;

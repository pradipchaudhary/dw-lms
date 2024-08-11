const errorMiddleware = (err, req, res, next) => {
    console.log("Hello, this is error handling middleware.");
    res.status(400).json({
        success: false,
        message: err.message,
    });
};

export default errorMiddleware;

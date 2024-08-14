// Authentication Middleware
import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
    try {
        // Step 1: Retrieve the authorization token from the request headers.
        const tokenString = req.headers.authorization;

        // Step 2: Split the token string to extract the actual token.
        // Typically, the token is provided in the format "Bearer <token>".
        const tokenArray = tokenString.split(" ");
        const token = tokenArray[1];

        // Step 3: Verify the JWT token using the secret key.
        // If the token is not valid, an error will be thrown.
        const user = await jwt.verify(token, process.env.JWT_SECRET);

        // Step 4: Attach the user's ID to the request object for use in subsequent middleware or routes.
        req._id = user.userId;

        // Step 5: Pass control to the next middleware function or route handler.
        next();
    } catch (error) {
        // Step 6: Handle any errors that occur during the token verification process
        // and send an error response with the error message.
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export default isAuth;

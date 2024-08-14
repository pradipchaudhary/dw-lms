import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { config } from "dotenv";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendmail.js";

config();

//  Get all uer controller
export const getAllUser = async (req, res, next) => {
    try {
        const data = await User.find();
        res.status(200).json({
            success: true,
            message: "Get all users",
            data: data,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Create User controller
export const createUser = async (req, res) => {
    try {
        // Step 1: Extract password and other user details from the request body
        const { password, ...rest } = req.body;

        // Step 2: Hash the password using bcrypt with a salt round of 10 for security
        const hashedPassword = await bcrypt.hash(password, 10);

        // Step 3: Create a user data object that includes the hashed password and an unverified status
        const data = {
            ...rest,
            isVerified: false,
            password: hashedPassword,
        };

        // Step 4: Save the new user to the database
        const result = await User.create(data);

        // Step 5: Generate a JSON Web Token (JWT) for email verification
        const info = {
            userId: result._id,
        };
        const token = await jwt.sign(info, process.env.JWT_SECRET, {
            expiresIn: "5d", // Token expires in 5 days
        });

        // Step 6: Send a confirmation email to the user with a verification link
        await sendEmail({
            from: "dw-lms <iamyounz@gmail.com>", // Sender's email
            to: [result.email], // Recipient's email (the user who registered)
            subject: "Confirm Your Registration", // Email subject
            html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Registration Confirmation</title>
            </head>
            <body>
                <h1>Welcome to Deerwalk Login Management System!</h1>

                <p>Hello ${result.fullname},</p>

                <p>Thank you for registering with us. Please confirm your email address by clicking the link below:</p>
                <a href="http://localhost:${process.env.PORT}/verify-email?token=${token}"> http://localhost:${process.env.PORT}/verify-email?token=${token}</a>
                <p>If you didn't register for this account, you can ignore this email.</p><br>
                
                Thank you!

                <p>Best regards,<br>
               <b>Your Deerwalk Login Management System Team</b></p>
            </body>
            </html>
        `,
        });

        // Step 7: Send a success response back to the client with the newly created user data
        res.status(201).json({
            success: true,
            message: "User created successfully!",
            data: result,
        });
    } catch (error) {
        // Step 8: Handle any errors that occur during the process and send an error response
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Verify Email controller
export const verifyEmail = async (req, res, next) => {
    try {
        // Step 1: Retrieve the authorization token from the request headers
        const tokenString = req.headers.authorization;

        // Step 2: Split the token string to extract the actual token (usually after the "Bearer" keyword)
        const tokenArray = tokenString.split(" ");
        const token = tokenArray[1];

        // Step 3: Verify the JWT token using the secret key to decode and validate the token
        const verifyToken = await jwt.verify(token, process.env.JWT_SECRET);

        // Step 4: Extract the user ID from the verified token payload
        const userId = verifyToken.userId;

        // Step 5: Update the user's isVerified status to true in the database using the extracted user ID
        const result = await User.findByIdAndUpdate(
            userId,
            { isVerified: true }, // Update the isVerified field to true
            { new: true } // Return the updated document
        );

        // Step 6: Send a success response back to the client with the updated user data
        res.status(200).json({
            success: true,
            message: "User verified successfully",
            data: result,
        });
    } catch (error) {
        // Step 7: Handle any errors that occur during the verification process and send an error response
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Login controller
export const login = async (req, res, next) => {
    try {
        // Step 1: Extract email and password from the request body
        const { email, password } = req.body;

        // Step 2: Find the user in the database by their email
        const user = await User.findOne({ email });

        // Step 3: Check if the user exists
        if (user) {
            // Step 4: Check if the user's email is verified
            if (user.isVerified) {
                // Step 5: Compare the provided password with the hashed password stored in the database
                const isValidPassword = await bcrypt.compare(
                    password,
                    user.password
                );

                // Step 6: If the password is valid, generate a JWT token
                if (isValidPassword) {
                    const info = {
                        userId: user._id,
                    };
                    const token = jwt.sign(info, process.env.JWT_SECRET, {
                        expiresIn: "365d", // Token expires in 365 days
                    });

                    // Step 7: Send a success response back to the client with the generated token
                    res.status(200).json({
                        success: true,
                        message: "User login successfully.",
                        data: token,
                    });
                } else {
                    // Step 8: If the password does not match, throw an error
                    throw new Error("Password does not match");
                }
            } else {
                // Step 9: If the user's email is not verified, throw an error
                throw new Error("Credential does not match");
            }
        } else {
            // Step 10: If the user is not found, throw an error
            throw new Error("User not found!");
        }
    } catch (error) {
        // Step 11: Handle any errors that occur during the login process and send an error response
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// View Profile controller
export const myProfile = async (req, res, next) => {
    try {
        // Step 1: Extract the user ID from the request object.
        // This ID is typically set by authentication middleware.
        const _id = req._id;

        // Step 2: Retrieve the user's profile from the database using the extracted user ID.
        const result = await User.findById(_id);

        // Step 3: Send a success response back to the client with the user's profile data.
        res.status(200).json({
            success: true,
            message: "Profile read successfully.",
            data: result,
        });
    } catch (error) {
        // Step 4: Handle any errors that occur during the profile retrieval process
        // and send an error response with the error message.
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Update Profile controller
export const updateProfile = async (req, res, next) => {
    try {
        // Step 1: Extract the user ID from the request object.
        // The ID is typically set by authentication middleware.
        const _id = req._id;

        // Step 2: Extract the data to be updated from the request body.
        const data = req.body;

        // Step 3: Remove the email and password fields from the data to prevent these fields from being updated.
        delete data.email;
        delete data.password;

        // Step 4: Update the user's profile in the database with the provided data.
        // The { new: true } option returns the updated document.
        const result = await User.findByIdAndUpdate(_id, data, { new: true });

        // Step 5: Send a success response back to the client with the updated user profile data.
        res.status(200).json({
            success: true,
            message: "Update successfully",
            data: result,
        });
    } catch (error) {
        // Step 6: Handle any errors that occur during the profile update process
        // and send an error response with the error message.
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Update Password controller
export const updatePassword = async (req, res, next) => {
    try {
        // Step 1: Extract the user ID from the request object.
        // This ID is typically set by authentication middleware.
        const _id = req._id;

        // Step 2: Extract the old password and new password from the request body.
        const { oldPassword, newPassword } = req.body;

        // Step 3: Retrieve the user's current password hash from the database using the user ID.
        const data = await User.findById(_id);
        const password = data.password;

        // Step 4: Compare the provided old password with the stored password hash to verify if they match.
        const isValidPassword = await bcrypt.compare(oldPassword, password);

        // Step 5: If the old password is valid, hash the new password.
        if (isValidPassword) {
            const newHashPassword = await bcrypt.hash(newPassword, 10);

            // Step 6: Update the user's password in the database with the new hashed password.
            const result = await User.findByIdAndUpdate(
                _id,
                { password: newHashPassword },
                { new: true } // Return the updated document
            );

            // Step 7: Send a success response back to the client confirming the password update.
            res.status(201).json({
                success: true,
                message: "Password updated successfully.",
                data: result,
            });
        } else {
            // Step 8: If the old password does not match, throw an error.
            throw new Error("Password doesn't match.");
        }
    } catch (error) {
        // Step 9: Handle any errors that occur during the password update process
        // and send an error response with the error message.
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// get single user controller
export const getSingleUser = async (req, res, next) => {
    try {
        const result = await User.findById(req.params.id);
        res.status(200).json({
            success: true,
            message: "Get single user.",
            data: result,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// update single user controller
export const updateSingleUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const data = req.body;
        delete data.email;
        delete data.password;

        const result = await User.findByIdAndUpdate(userId, data, {
            new: true,
        });
        console.log(result);
        res.status(201).json({
            success: true,
            message: "User update successfully.",
            data: result,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// delete single user controller
export const delteSingleUser = async (req, res, next) => {
    try {
        const userId = req.params.id;

        const result = await User.findByIdAndDelete(userId);
        res.status(201).json({
            success: true,
            message: "User delete successfully.",
            data: result,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

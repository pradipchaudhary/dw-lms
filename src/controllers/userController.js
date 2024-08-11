import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { config } from "dotenv";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendmail.js";

config();
// Get all User
export const getAllUser = async (req, res) => {
    try {
        const data = await User.find({});
        res.status(200).json({
            success: true,
            message: "Get all user !",
            data,
        });
    } catch (error) {
        res.status(400).json({
            success: true,
            message: error.message,
        });
    }
};

// Create User
export const createUser = async (req, res) => {
    try {
        const { password, ...rest } = req.body;
        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const data = {
            ...rest,
            isVerified: false,
            password: hashedPassword,
        };
        const result = await User.create(data);

        // Generate token
        const info = {
            userId: result._id,
        };
        const token = await jwt.sign(info, process.env.JWT_SECRET, {
            expiresIn: "5d",
        });

        // Send email
        await sendEmail({
            from: "dw-lms <iamyounz@gmail.com>",
            to: [result.email],
            subject: "Confirm Your Registration",
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
               <b> Your Deerwalk Login Management System Team </b></p>
            </body>
            </html>

        </p>`,
        });

        res.status(201).json({
            success: true,
            message: "User created successfully!",
            data: result,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const verifyEmail = async (req, res, next) => {
    try {
        console.log("Verify Email...");
        const tokenString = req.headers.authorization;
        const tokenArray = tokenString.split(" ");
        const token = tokenArray[1];

        // Verify token
        const verifyToken = await jwt.verify(token, process.env.JWT_SECRET);
        const userId = verifyToken.userId;

        const result = await User.findByIdAndUpdate(
            userId,
            { isVerified: true },
            { new: true }
        );

        console.log(result);
        res.status(200).json({
            success: true,
            message: "User verified successfully",
            data: result,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(email);
        const user = await User.findOne({ email });
        if (user) {
            if (user.isVerified) {
                const isValidPassword = await bcrypt.compare(
                    password,
                    user.password
                );
                if (isValidPassword) {
                    // Generate token
                    const info = {
                        userId: user._id,
                    };
                    const token = jwt.sign(info, process.env.JWT_SECRET, {
                        expiresIn: "365d",
                    });
                    res.status(200).json({
                        success: true,
                        message: "User login successfully.",
                        data: token,
                    });
                } else {
                    throw new Error("Password does not match");
                }
            } else {
                throw new Error("Credential does not match ");
            }
        } else {
            throw new Error("User not found!");
        }
        console.log(user);
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

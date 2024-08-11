import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";

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
        let { password, ...rest } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const data = {
            ...rest,
            password: hashedPassword,
            isVerifiedEmail: false,
        };

        const result = await User.create(data);
        res.status(201).json({
            success: true,
            message: "User created successfully!",
            data: result,
        });
        console.log(data);
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

//

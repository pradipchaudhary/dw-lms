import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        fullname: {
            type: String,
            required: [true, "Full name is requred !"],
            trim: true,
            minlength: [3, "Username must be at least 3 characters long"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                "Please add a valid email address",
            ],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters long"],
        },
        dob: {
            type: Date,
            required: [true, "Date of Birth is required"],
        },
        gender: {
            type: String,
            required: [true, "Gender is required"],
            enum: ["male", "female", "other"],
        },
        role: {
            type: String,
            required: [true, "Role is required"],
            enum: ["superAdmin", "admin", "customer"],
            default: "customer",
        },
    },
    { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
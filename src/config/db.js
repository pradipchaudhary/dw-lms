import { config } from "dotenv";
import mongoose from "mongoose";
config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log("Could not connect to MongoDB...", error.message);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;

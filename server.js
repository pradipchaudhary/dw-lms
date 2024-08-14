import { config } from "dotenv";
import express, { json } from "express";
import connectDB from "./src/config/db.js";
import userRoutes from "./src/routes/userRoutes.js";
import cors from "cors";
import errorHandler from "./src/middleware/errorMiddleware.js";

config();

const app = express();
const PORT = process.env.PORT || 9000;

// Connect to MongoDB
connectDB();

// middleware
app.use(json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Home page ");
});

// Routers
app.use("/api/user", userRoutes);

// Error handling middleware should be used last
app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}.`);
});

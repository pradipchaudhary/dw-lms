import { config } from "dotenv";
import express from "express";

config();

const app = express();
const PORT = process.env.PORT || 9000;

app.get("/", (req, res) => {
    res.send("Home page ");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}.`);
});

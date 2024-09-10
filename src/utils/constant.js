import { config } from "dotenv";

config();

export const secretKey = process.env.SECRET_KEY;
export const user = process.env.USER;
export const pass = process.env.PASS;

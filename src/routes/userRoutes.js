import { Router } from "express";
import {
    createUser,
    getAllUser,
    login,
    verifyEmail,
} from "../controllers/userController.js";

const userRoutes = Router();

userRoutes.route("/").get(getAllUser);
userRoutes.route("/register").post(createUser);
userRoutes.route("/verify-email").patch(verifyEmail);
userRoutes.route("/login").post(login);

export default userRoutes;

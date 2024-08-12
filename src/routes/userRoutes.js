import { Router } from "express";
import {
    createUser,
    login,
    myProfile,
    updatePassword,
    updateProfile,
    verifyEmail,
} from "../controllers/userController.js";
import isAuth from "../middleware/authMiddleware.js";

const userRoutes = Router();

userRoutes.route("/register").post(createUser);
userRoutes.route("/verify-email").patch(verifyEmail);
userRoutes.route("/login").post(login);

userRoutes.route("/my-profile").get(isAuth, myProfile);
userRoutes.route("/update-profile").patch(isAuth, updateProfile);
userRoutes.route("/update-password").patch(isAuth, updatePassword);

export default userRoutes;

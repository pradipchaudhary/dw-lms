import { Router } from "express";
import {
    createUser,
    delteSingleUser,
    getAllUser,
    getSingleUser,
    login,
    myProfile,
    updatePassword,
    updateProfile,
    updateSingleUser,
    verifyEmail,
} from "../controllers/userController.js";
import isAuth from "../middleware/authMiddleware.js";

const userRoutes = Router();
userRoutes.route("/").get(getAllUser);
userRoutes.route("/register").post(createUser);
userRoutes.route("/verify-email").patch(verifyEmail);
userRoutes.route("/login").post(login);

userRoutes.route("/my-profile").get(isAuth, myProfile);
userRoutes.route("/update-profile").patch(isAuth, updateProfile);
userRoutes.route("/update-password").patch(isAuth, updatePassword);

userRoutes
    .route("/:id")
    .get(getSingleUser)
    .patch(updateSingleUser)
    .delete(delteSingleUser);

export default userRoutes;

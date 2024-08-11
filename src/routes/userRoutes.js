import { Router } from "express";
import { createUser, getAllUser } from "../controllers/userController.js";

const userRoutes = Router();

userRoutes.route("/").get(getAllUser).post(createUser);

export default userRoutes;

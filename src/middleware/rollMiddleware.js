import { User } from "../models/userModel.js";

const rollMiddleware = (roles) => {
    return async (req, res, next) => {
        try {
            // if (!roles.includes(req.user.role)) {
            //     return res.status(403).json({ msg: "Access denied" });
            // }
            const _id = req._id;
            const user = await User.findById(_id);
            if (roles.includes(user.role)) {
                console.log("roll promited...");
                next();
            } else {
                console.log("roll not promitted...");
            }
            // console.log(roles);
        } catch (error) {
            res.status(403).json({
                success: false,
                message: "Access denied",
            });
        }
    };
};

export default rollMiddleware;

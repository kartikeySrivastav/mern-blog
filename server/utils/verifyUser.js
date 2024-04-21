import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.cookies["access-token"];

    if (!token) {
        return next(errorHandler(401, "unauthorized"));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return next(errorHandler(401, "Unauthorized user"));
        }
        req.user = user;
        next();
    });
};

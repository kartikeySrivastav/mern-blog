import express from "express";
import {
    signupUser,
    loginUser,
    googleAuth,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/signin", loginUser);
router.post("/google", googleAuth);

export default router;

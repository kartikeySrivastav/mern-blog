import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();
import { createPost } from "../controllers/post.controller.js";

router.post("/create", verifyToken, createPost);

export default router;

import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();
import {
    createPost,
    getPosts,
    deletePost,
    UpdatePost,
} from "../controllers/post.controller.js";

router.post("/create", verifyToken, createPost);
router.get("/getposts", getPosts);
router.delete("/deletepost/:postId/:userId", verifyToken, deletePost);
router.put("/updatepost/:postId/:userId", verifyToken, UpdatePost);

export default router;

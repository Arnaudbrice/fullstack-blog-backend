import express from "express";
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
} from "../controllers/postController.js";

const postRouter = express.Router();

postRouter
  .route("/")
  .get(getPosts)
  .post(createPost);

postRouter
  .route("/:id")
  .get(getPostById)
  .put(updatePost)
  .delete(deletePost);

export default postRouter;

import express from "express";
import { getFiles, removeFile } from "../controllers/file.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, getFiles);
router.delete("/remove/:id",verifyToken, removeFile);

export default router;
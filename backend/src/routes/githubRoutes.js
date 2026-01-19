import express from "express";
import { getProfile } from "../controllers/githubController.js";

const router = express.Router();

router.get("/:username", getProfile);

export default router;

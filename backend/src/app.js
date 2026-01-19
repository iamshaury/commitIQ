import express from "express";
import cors from "cors";
import githubRoutes from "./routes/githubRoutes.js";

const app = express();

app.use(cors());
app.use("/github", githubRoutes);

export default app;

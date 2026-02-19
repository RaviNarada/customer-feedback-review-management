import express from "express";
import cors from "cors";
import analysisRoutes from "./modules/analysis/analysis.routes";
import errorMiddleware from "./middleware/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/analysis", analysisRoutes);

app.use(errorMiddleware);

export default app;

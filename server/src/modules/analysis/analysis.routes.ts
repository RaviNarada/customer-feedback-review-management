import { Router } from "express";
import * as trainerController from "./analysis.controller";

const router = Router();

router.get("/", trainerController.getFeedback);
//router.post("/", trainerController.createTrainer);

export default router;

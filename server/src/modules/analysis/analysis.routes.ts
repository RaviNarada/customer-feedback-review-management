import { Router } from "express";
import * as trainerController from "./analysis.controller";

const router = Router();

router.get("/", trainerController.getFeedback);
router.get("/test",trainerController.test);
router.get("/sentiment",trainerController.getSentiment);
//router.post("/", trainerController.createTrainer);

export default router;

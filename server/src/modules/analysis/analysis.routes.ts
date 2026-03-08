import { Router } from "express";
import * as trainerController from "./analysis.controller";

const router = Router();

router.get("/", trainerController.getFeedback);
router.get("/test",trainerController.test);
router.post("/sentiment",trainerController.getSentiment);
router.post("/export",trainerController.fileDownload);
//router.post("/", trainerController.createTrainer);

export default router;

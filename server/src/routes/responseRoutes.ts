import { Router } from 'express';
import { ResponseController } from '../controllers/responseController';

const router = Router();
const responseController = new ResponseController();

router.post('/feedback/:feedbackId', responseController.createResponse.bind(responseController));

router.get('/feedback/:feedbackId', responseController.getResponseByFeedbackId.bind(responseController));

router.put('/:id', responseController.updateResponse.bind(responseController));

router.delete('/:id', responseController.deleteResponse.bind(responseController));

export default router;

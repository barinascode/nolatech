import validateRequest from '../../../shared/middlewares/validate.request.middleware';
import express from 'express';
import { CreateFeedbackDTO } from '../dtos/feedback.dto';
import FeedbackController from '../controllers/feedback.controller';
const feedbackRoutes = express.Router();

const feedbackController = new FeedbackController();

// Rutas de feedback
feedbackRoutes.post('/', validateRequest(CreateFeedbackDTO), feedbackController.createFeedback.bind(feedbackController));
feedbackRoutes.get('/:id', feedbackController.getFeedback.bind(feedbackController));

export default feedbackRoutes;
// Rutas (Routes)
import express from 'express';
import EvaluationController from '../controllers/evaluations.controller';
import validateRequest from '../../../shared/middlewares/validate.request.middleware';
import { CreateEvaluationDTO, UpdateEvaluationDTO } from '../dtos/evaluation.dto';

const evaluationRoutes = express.Router();
const evaluationController = new EvaluationController();

// Rutas de evaluaciones

evaluationRoutes.post('/', validateRequest(CreateEvaluationDTO), evaluationController.createEvaluation.bind(evaluationController));
evaluationRoutes.get('/:id', evaluationController.getEvaluation.bind(evaluationController));
evaluationRoutes.put('/:id', validateRequest(UpdateEvaluationDTO), evaluationController.updateEvaluation.bind(evaluationController));
evaluationRoutes.get('/employee/:id', evaluationController.getEvaluationsByEmployeeId.bind(evaluationController));
evaluationRoutes.post('/:id/finalize', evaluationController.finalizeEvaluation.bind(evaluationController)); // Nueva ruta para finalizar evaluación



export default evaluationRoutes;
import { Types } from 'mongoose';
import { FeedbackRepository } from '../repositories/feedback.repository';
import { EvaluationRepository } from '@/modules/evaluation/repositories/evaluation.repository';
import { Feedback } from '../models/feedback.model';

export default class CreateFeedbackUseCase {
    constructor(private feedbackRepository: FeedbackRepository, private evaluationRepository: EvaluationRepository) { }

    async execute(feedback: Feedback, evaluationId: Types.ObjectId): Promise<Feedback> {

        // 1. Verificar si ya se ha respondido a la evaluación
        const evaluation = await this.evaluationRepository.getById(evaluationId);
        if (!evaluation) {
            throw new Error('Evaluation not found.');
        }


        // check if existing feedback and was replied
        const existingFeedback = await this.feedbackRepository.getFeedbackByEvaluatorIdAndEvaluationId(feedback.evaluator_id, evaluationId);
        if (existingFeedback?.replied) {
            throw new Error('Feedback already submitted and cannot be modified.');
        }
        
        const createdFeedback = await this.feedbackRepository.create(feedback);
        await this.evaluationRepository.addFeedbackIdToEvaluation(evaluationId, createdFeedback._id);
        return createdFeedback;
    }
}
import { Types } from 'mongoose';
import FeedbackModel, { Feedback } from "../models/feedback.model";
import { FeedbackRepository } from './feedback.repository';

export class FeedbackRepositoryImpl implements FeedbackRepository {

    async create(feedback: Feedback): Promise<Feedback> {
        const createdFeedback = await FeedbackModel.create({
            ...feedback,
            replied: true
        });
        return createdFeedback;
    }

    async getById(id: Types.ObjectId): Promise<Feedback | null> {
        return FeedbackModel.findById(id).populate('evaluator_id evaluation_id').exec();
    }

    // method for get feedback by evaluator_id and evaluation_id
    async getFeedbackByEvaluatorIdAndEvaluationId(evaluatorId: Types.ObjectId, evaluationId: Types.ObjectId): Promise<Feedback | null> {
        return FeedbackModel.findOne({ evaluator_id: evaluatorId, evaluation_id: evaluationId }).exec();
    }

    // async update(id: Types.ObjectId, updates: Partial<Feedback>): Promise<Feedback | null> {
    //     return FeedbackModel.findByIdAndUpdate(id, updates, { new: true }).exec();
    // }
}
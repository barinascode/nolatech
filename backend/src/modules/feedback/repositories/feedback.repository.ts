import { Types } from 'mongoose';
import { Feedback } from "../models/feedback.model";

export interface FeedbackRepository {
    create(feedback: Feedback): Promise<Feedback>;
    getById(id: Types.ObjectId): Promise<Feedback | null>;
    getFeedbackByEvaluatorIdAndEvaluationId(evaluatorId: Types.ObjectId, evaluationId: Types.ObjectId):Promise<Feedback | null>;
    // update(id: Types.ObjectId, updates: Partial<Feedback>): Promise<Feedback | null>;
}
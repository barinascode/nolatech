import { EvaluationDocument } from "../models/evaluations.model";
import { Types } from 'mongoose';

export interface EvaluationRepository {
    create(evaluation: EvaluationDocument): Promise<EvaluationDocument>;
    getById(id: Types.ObjectId): Promise<EvaluationDocument | null>;
    update(id: Types.ObjectId, updates: Partial<EvaluationDocument>): Promise<EvaluationDocument | null>;
    getEvaluationsByEmployeeId(employeeId: Types.ObjectId): Promise<EvaluationDocument[]>;
    addFeedbackIdToEvaluation(evaluationId: Types.ObjectId, feedbackId: Types.ObjectId): Promise<void>;
}

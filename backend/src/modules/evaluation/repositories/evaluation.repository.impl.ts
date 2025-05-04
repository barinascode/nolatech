import { Types } from 'mongoose';
import { EvaluationRepository } from './evaluation.repository';
import EvaluationModel, { EvaluationDocument } from '../models/evaluations.model';

export default class EvaluationRepositoryImpl implements EvaluationRepository {

    async create(evaluation: EvaluationDocument): Promise<EvaluationDocument> {
        const createdEvaluation = await EvaluationModel.create(evaluation);
        return createdEvaluation;
    }

    async getById(id: Types.ObjectId): Promise<EvaluationDocument | null> {
        return EvaluationModel.findById(id)
        .populate({
            'path': 'employee_id',
            'select': 'first_name last_name'
        })
        .populate({
            'path': 'evaluator_ids',
            'select': 'first_name last_name'
        })
        .populate({
            'path': 'feedback_ids',
            'select': 'evaluator_id comment rating competency_scores',
            'populate': {
                'path': 'evaluator_id',
                'select': 'first_name last_name'
            }
        })
        .populate({
            'path': 'evaluated_id',
            'select': 'first_name last_name'
        })
        .exec();
    }

    async update(id: Types.ObjectId, updates: Partial<EvaluationDocument>): Promise<EvaluationDocument | null> {
        return EvaluationModel.findByIdAndUpdate(id, updates, { new: true }).exec();
    }

    async getEvaluationsByEmployeeId(employeeId: Types.ObjectId): Promise<EvaluationDocument[]> {
        return EvaluationModel.find({ employee_id: employeeId }).populate('employee_id evaluator_ids feedback_ids evaluated_id').exec();
    }
    async addFeedbackIdToEvaluation(evaluationId: Types.ObjectId, feedbackId: Types.ObjectId): Promise<void> {
        await EvaluationModel.findByIdAndUpdate(evaluationId, { $push: { feedback_ids: feedbackId } }).exec();
    }
}
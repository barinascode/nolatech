import { EvaluationDocument } from "../models/evaluations.model";
import { EvaluationRepository } from "../repositories/evaluation.repository";
import { Types } from 'mongoose';

export class UpdateEvaluationUseCase {
    constructor(private evaluationRepository: EvaluationRepository) { }

    async execute(id: Types.ObjectId, updates: Partial<EvaluationDocument>): Promise<EvaluationDocument | null> {
        return this.evaluationRepository.update(id, updates);
    }
}
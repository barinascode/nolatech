
import { EvaluationDocument } from "../models/evaluations.model";
import { EvaluationRepository } from "../repositories/evaluation.repository";
import { Types } from 'mongoose';

export class GetEvaluationUseCase {
    constructor(private evaluationRepository: EvaluationRepository) { }

    async execute(id: Types.ObjectId): Promise<EvaluationDocument | null> {
        const evaluation = await this.evaluationRepository.getById(id);
        if (!evaluation) {
            return null;
        }

        return evaluation

        }

}
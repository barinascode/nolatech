import { EvaluationDocument } from "../models/evaluations.model";
import { EvaluationRepository } from "../repositories/evaluation.repository";
import { Types } from 'mongoose';

export class GetEvaluationsByEmployeeIdUseCase {
    constructor(private evaluationRepository: EvaluationRepository) { }

    async execute(employeeId: Types.ObjectId): Promise<EvaluationDocument[]> {
        return this.evaluationRepository.getEvaluationsByEmployeeId(employeeId);
    }
}
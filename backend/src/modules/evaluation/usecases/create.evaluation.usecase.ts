import { EvaluationDocument } from "../models/evaluations.model";
import { EvaluationRepository } from "../repositories/evaluation.repository";

export class CreateEvaluationUseCase {
    constructor(private evaluationRepository: EvaluationRepository) { }

    async execute(evaluation: EvaluationDocument): Promise<EvaluationDocument> {
        return this.evaluationRepository.create(evaluation);
    }
}
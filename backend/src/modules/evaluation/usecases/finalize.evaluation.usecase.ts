// import { FeedbackRepository } from "@/modules/feedback/repositories/feedback.repository";
import { EvaluationRepository } from "../repositories/evaluation.repository";
import { Types } from 'mongoose';
import FeedbackModel from "../../../modules/feedback/models/feedback.model";

export default class FinalizeEvaluationUseCase {
    constructor(private evaluationRepository: EvaluationRepository, /* private _feedbackRepository: FeedbackRepository*/) { }

    async execute(evaluationId: Types.ObjectId): Promise<void> {
        // 1. Obtener la evaluación
        const evaluation = await this.evaluationRepository.getById(evaluationId);
        if (!evaluation) {
            throw new Error('Evaluation not found'); // Lanza un error si no se encuentra la evaluación
        }

        // 2. Verificar si todos los evaluadores han enviado su feedback
        if (evaluation.evaluator_ids.length !== evaluation.feedback_ids.length) {
            throw new Error('Not all evaluators have submitted feedback'); // Lanza un error si no todos han respondido
        }
        // 3. Actualizar el estado de la evaluación a "completed"
        await this.evaluationRepository.update(evaluationId, { status: 'completed' });

        // 4. Calcular los resultados (promedios de competencias)
        // Aquí iría la lógica para calcular los promedios de las puntuaciones de las competencias
        // Puedes iterar sobre los feedback_ids de la evaluación, obtener cada feedback
        // y calcular el promedio de los competency_scores.
        // Por simplicidad, este ejemplo no incluye el cálculo detallado, pero aquí es donde se haría.

        const feedbacks = await FeedbackModel.find({ _id: { $in: evaluation.feedback_ids } }).exec();

        let competenciaScores: Record<string, number[]> = {};

        feedbacks.forEach(feedback => {
            for (const competencia in feedback.competency_scores) {
                if (!competenciaScores[competencia]) {
                    competenciaScores[competencia] = [];
                }
                competenciaScores[competencia].push(feedback.competency_scores[competencia]);
            }
        });

        let promedioCompetencias: Record<string, number> = {};
        for (const competencia in competenciaScores) {
            const sum = competenciaScores[competencia].reduce((a, b) => a + b, 0);
            promedioCompetencias[competencia] = sum / competenciaScores[competencia].length;
        }
        
        console.log("Promedio de Competencias", promedioCompetencias);

    }
}
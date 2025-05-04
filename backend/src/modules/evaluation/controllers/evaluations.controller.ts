import { Types } from 'mongoose';
//import { FeedbackRepositoryImpl } from "../../../modules/feedback/repositories/feedback.repository.impl";
import { EvaluationRepository } from "../repositories/evaluation.repository";
import EvaluationRepositoryImpl from "../repositories/evaluation.repository.impl";
import { CreateEvaluationUseCase } from "../usecases/create.evaluation.usecase";
import FinalizeEvaluationUseCase from "../usecases/finalize.evaluation.usecase";
import { GetEvaluationUseCase } from "../usecases/get.evaluation.usecase";
import { GetEvaluationsByEmployeeIdUseCase } from "../usecases/get.evaluations.by.employee.id.usecase";
import { UpdateEvaluationUseCase } from "../usecases/update.evaluation.usecase";
import { NextFunction, Request, Response } from "express";
import { EvaluationResponseDTO } from "../dtos/response.dto";

export default class EvaluationController {
    private evaluationRepository: EvaluationRepository;
    private createEvaluationUseCase: CreateEvaluationUseCase;
    private getEvaluationUseCase: GetEvaluationUseCase;
    private updateEvaluationUseCase: UpdateEvaluationUseCase;
    private getEvaluationsByEmployeeIdUseCase: GetEvaluationsByEmployeeIdUseCase;
    private finalizeEvaluationUseCase: FinalizeEvaluationUseCase;

    constructor() {
        this.evaluationRepository = new EvaluationRepositoryImpl();
        this.createEvaluationUseCase = new CreateEvaluationUseCase(this.evaluationRepository);
        this.getEvaluationUseCase = new GetEvaluationUseCase(this.evaluationRepository);
        this.updateEvaluationUseCase = new UpdateEvaluationUseCase(this.evaluationRepository);
        this.getEvaluationsByEmployeeIdUseCase = new GetEvaluationsByEmployeeIdUseCase(this.evaluationRepository);
        this.finalizeEvaluationUseCase = new FinalizeEvaluationUseCase(this.evaluationRepository,
            // new FeedbackRepositoryImpl()
            );
    }

    async createEvaluation(req: Request, res: Response, next: NextFunction):Promise<any> {
        try {
            const evaluationDTO = req.body;
            const evaluation = await this.createEvaluationUseCase.execute(evaluationDTO);
            res.status(201).json(new EvaluationResponseDTO(evaluation));
        } catch (error) {
            next(error);
        }
    }

    async getEvaluation(req: Request, res: Response, next: NextFunction):Promise<any> {
        try {
            const evaluation = await this.getEvaluationUseCase.execute(new Types.ObjectId(req.params.id));
            if (!evaluation) {
                return res.status(404).json({ message: 'Evaluation not found' });
            }
            res.status(200).json(new EvaluationResponseDTO(evaluation));
        } catch (error) {
            next(error);
        }
    }

    async updateEvaluation(req: Request, res: Response, next: NextFunction):Promise<any> {
        try {
            const evaluation = await this.updateEvaluationUseCase.execute(new Types.ObjectId(req.params.id), req.body);
            if (!evaluation) {
                return res.status(404).json({ message: 'Evaluation not found' });
            }
            res.status(200).json(new EvaluationResponseDTO(evaluation));
        } catch (error) {
            next(error);
        }
    }

    async getEvaluationsByEmployeeId(req: Request, res: Response, next: NextFunction) {
        try {
            const evaluations = await this.getEvaluationsByEmployeeIdUseCase.execute(new Types.ObjectId(req.params.id));
            res.status(200).json(evaluations.map(evaluation => new EvaluationResponseDTO(evaluation)));
        } catch (error) {
            next(error);
        }
    }
    async finalizeEvaluation(req: Request, res: Response, next: NextFunction) {
        try {
            await this.finalizeEvaluationUseCase.execute(new Types.ObjectId(req.params.id));
            res.status(200).json({ message: 'Evaluation finalized successfully' });
        } catch (error) {
            next(error);
        }
    }
}
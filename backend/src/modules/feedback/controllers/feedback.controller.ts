import { Types } from 'mongoose';
import EvaluationRepositoryImpl from "../../../modules/evaluation/repositories/evaluation.repository.impl";
import { FeedbackRepository } from "../repositories/feedback.repository";
import { FeedbackRepositoryImpl } from "../repositories/feedback.repository.impl";
import CreateFeedbackUseCase from "../usecases/create.feedback.usecase";
import GetFeedbackUseCase from "../usecases/get.feedback.usecase";
import { NextFunction, Request, Response } from "express";
import { FeedbackResponseDTO } from '../dtos/feedback.dto';


export default class FeedbackController {
    private feedbackRepository: FeedbackRepository;
    private createFeedbackUseCase: CreateFeedbackUseCase;
    private getFeedbackUseCase: GetFeedbackUseCase;

    constructor() {
        this.feedbackRepository = new FeedbackRepositoryImpl();
        this.createFeedbackUseCase = new CreateFeedbackUseCase(this.feedbackRepository, new EvaluationRepositoryImpl());
        this.getFeedbackUseCase = new GetFeedbackUseCase(this.feedbackRepository);
    }

    async createFeedback(req: Request, res: Response, next: NextFunction) {
        try {
            const feedback = await this.createFeedbackUseCase.execute(req.body, new Types.ObjectId(req.body.evaluation_id));
            res.status(201).json(new FeedbackResponseDTO(feedback));
        } catch (error) {
            next(error);
        }
    }

    async getFeedback(req: Request, res: Response, next: NextFunction):Promise<any> {
        try {
            const feedback = await this.getFeedbackUseCase.execute(new Types.ObjectId(req.params.id));
            if (!feedback) {
                return res.status(404).json({ message: 'Feedback not found' });
            }
            res.status(200).json(new FeedbackResponseDTO(feedback));
        } catch (error) {
            next(error);
        }
    }
}
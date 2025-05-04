import { Feedback } from "../models/feedback.model";
import { FeedbackRepository } from "../repositories/feedback.repository";
import { Types } from 'mongoose';

export default class GetFeedbackUseCase {
    constructor(private feedbackRepository: FeedbackRepository) { }

    async execute(id: Types.ObjectId): Promise<Feedback | null> {
        return this.feedbackRepository.getById(id);
    }
}
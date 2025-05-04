import { IsString, IsNumber, IsNotEmpty, IsMongoId, Max, Min } from 'class-validator';
import { Feedback } from '../models/feedback.model';


export class CreateFeedbackDTO {
    @IsMongoId()
    @IsNotEmpty()
    evaluator_id: string;

    @IsMongoId()
    @IsNotEmpty()
    evaluation_id: string;

    @IsString()
    @IsNotEmpty()
    comment: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    @Max(5)
    rating: number;

    @IsNotEmpty()
    competency_scores: Record<string, number>;
}

export class FeedbackResponseDTO {
    _id: string;
    evaluator_id: string;
    evaluation_id: string;
    comment: string;
    rating: number;
    date: Date;
    competency_scores: Record<string, number>;

    constructor(feedback: Feedback) {
        this._id = feedback._id.toHexString();
        this.evaluator_id = feedback.evaluator_id.toString();
        this.evaluation_id = feedback.evaluation_id.toString();
        this.comment = feedback.comment;
        this.rating = feedback.rating;
        this.date = feedback.date;
        this.competency_scores = feedback.competency_scores;
    
    }
}
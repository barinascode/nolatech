import { Types } from "mongoose";
import { EvaluationDocument, Question } from "../models/evaluations.model";


export class EvaluationResponseDTO {
    _id: Types.ObjectId;
    name: string;
    description: string;
    employee_id: Types.ObjectId;
    evaluator_ids: Types.ObjectId[];
    start_date: Date;
    end_date: Date;
    status: string;
    questions: Question[];
    evaluated_id: Types.ObjectId;
    feedback_ids: Types.ObjectId[];

    constructor(evaluation: EvaluationDocument) {
        this._id = evaluation._id;
        this.name = evaluation.name;
        this.description = evaluation.description;
        this.employee_id = evaluation.employee_id;
        this.evaluator_ids = evaluation.evaluator_ids.map(id => id);
        this.start_date = evaluation.start_date;
        this.end_date = evaluation.end_date;
        this.status = evaluation.status;
        this.questions = evaluation.questions;
        this.feedback_ids = evaluation.feedback_ids.map(id => id);
        this.evaluated_id = evaluation.evaluated_id;

    }
}


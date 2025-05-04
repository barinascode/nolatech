import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface Feedback extends Document {
    _id: Types.ObjectId;
    evaluator_id: Types.ObjectId;
    evaluation_id: Types.ObjectId;
    comment: string;
    rating: number;
    date: Date;
    competency_scores: Record<string, number>; // Para almacenar puntajes de competencias
    replied: boolean; // Nuevo campo para indicar si ya se respondió a este feedback
}

const FeedbackSchema: Schema = new Schema({
    evaluator_id: { type: Schema.Types.ObjectId, ref: 'Employee', required: true }, // Referencia al modelo de Empleado
    evaluation_id: { type: Schema.Types.ObjectId, ref: 'Evaluation', required: true }, // Referencia al modelo de Evaluación
    comment: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    date: { type: Date, default: Date.now },
    competency_scores: { type: Object, required: true },
    replied: { type: Boolean, default: false }
});


const FeedbackModel: Model<Feedback> = mongoose.model<Feedback>('Feedback', FeedbackSchema);

export default FeedbackModel;
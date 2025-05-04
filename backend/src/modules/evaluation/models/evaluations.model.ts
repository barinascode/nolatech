import mongoose, { Schema, Document, Model, Types } from 'mongoose';

// Interfaces y tipos

export interface Question {
    type: 'open' | 'scale';
    text: string;
    competency?: string; // Agregado para relacionar con las competencias
}

export interface EvaluationDocument extends Document {
    _id: Types.ObjectId;
    name: string;
    description: string;
    employee_id: Types.ObjectId   // Referencia al modelo de Empleado
    evaluator_ids: Types.ObjectId[];
    start_date: Date;
    end_date: Date;
    status: string; // 'pending', 'in progress', 'completed'
    feedback_ids: Types.ObjectId[];
    questions: Question[];
    evaluated_id: Types.ObjectId;
}

// Esquemas de Mongoose
const QuestionSchema: Schema = new Schema({
    type: { type: String, enum: ['open', 'scale'], required: true },
    text: { type: String, required: true },
    competency: { type: String }
});

const EvaluationSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    employee_id: { type: Schema.Types.ObjectId, ref: 'Employee', required: true }, // Referencia al modelo de Empleado
    evaluator_ids: [{ type: Schema.Types.ObjectId, ref: 'Employee' }], // Referencia al modelo de Empleado
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'in progress', 'completed'], default: 'pending' },
    feedback_ids: [{ type: Schema.Types.ObjectId, ref: 'Feedback' }], // Referencia al modelo de Feedback
    questions: [QuestionSchema],
    evaluated_id: { type: Schema.Types.ObjectId, ref: 'Employee', required: true }
});

// Modelos de Mongoose
const EvaluationModel: Model<EvaluationDocument> = mongoose.model<EvaluationDocument>('Evaluation', EvaluationSchema);

export default EvaluationModel;

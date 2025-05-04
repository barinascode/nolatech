import mongoose, { Schema, Document, Types } from 'mongoose';

export interface EmployeeDocument extends Document {
    _id: Types.ObjectId;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role: string;
    active: Boolean;
    hire_date: Date;
    created_at: Date;
    updated_at: Date;
}

const employeeSchema = new Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['Admin', 'Manager', 'Employee'], default: 'Employee' },
    active: { type: Boolean, required: true },
    hire_date: { type: Date, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
}, { timestamps: true });

const EmployeeModel = mongoose.model<EmployeeDocument>('Employee', employeeSchema);

export default EmployeeModel;
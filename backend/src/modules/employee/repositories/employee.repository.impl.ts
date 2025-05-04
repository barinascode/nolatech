
import EmployeeModel, { EmployeeDocument } from '../models/employee.model';
import { EmployeesRepository } from './employee.repository';

export class EmployeesRepositoryImpl implements EmployeesRepository {

    async findAll(page: number, limit: number): Promise<{ employees: EmployeeDocument[], total: number }> {

        const skip = (page - 1) * limit;

        const employees = await EmployeeModel.find()
            
            .skip(skip)
            .limit(limit)
            .exec();

        const total = await EmployeeModel.countDocuments();
        return { employees, total };
    }

    async findOne(id: string): Promise<EmployeeDocument | null> {
        return EmployeeModel.findById(id).populate({
            path: 'userId',
            select: 'first_name last_name email role created_at updated_at'
        }).exec();
    }

    async create(employee: Partial<EmployeeDocument>): Promise<EmployeeDocument> {
        const newEmployee = new EmployeeModel(employee);
        return newEmployee.save();
    }

    async update(id: string, updates: Partial<EmployeeDocument>): Promise<EmployeeDocument | null> {
        return EmployeeModel.findByIdAndUpdate(id, updates, { new: true }).exec();
    }

    async delete(id: string): Promise<void> {
        await EmployeeModel.findByIdAndDelete(id).exec();
    }

    async getEmployeeByEmail(email: string): Promise<EmployeeDocument | null> {
        return EmployeeModel.findOne({ email }).exec();
    }
    
}
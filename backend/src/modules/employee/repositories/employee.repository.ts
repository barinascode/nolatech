import { EmployeeDocument } from "../models/employee.model";

export interface EmployeesRepository {
    findAll(page: number, limit: number): Promise<{ employees: EmployeeDocument[], total: number }>;
    findOne(id: string): Promise<EmployeeDocument | null>;
    create(employee: Partial<EmployeeDocument>): Promise<EmployeeDocument>;
    update(id: string, updates: Partial<EmployeeDocument>): Promise<EmployeeDocument | null>;
    delete(id: string): Promise<void>;
    getEmployeeByEmail(email: string): Promise<EmployeeDocument | null>;
}
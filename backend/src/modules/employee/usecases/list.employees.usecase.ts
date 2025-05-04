
import { EmployeeDocument } from '../models/employee.model';
import { EmployeesRepository } from '../repositories/employee.repository';


export class ListEmployeesUseCase {
    constructor(private employeesRepository: EmployeesRepository) {}

    async execute(page: number, limit: number): Promise<{ employees: EmployeeDocument[], total: number }> {
        // Lógica para listar empleados con paginación
        return this.employeesRepository.findAll(page, limit);
    }
}
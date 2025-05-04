import { Request, Response } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ListEmployeesUseCase } from '../usecases/list.employees.usecase';
import { ListEmployeesRequestDTO } from '../dto/list.employees.request.dto';
import { ListEmployeesResponseDTO } from '../dto/list.employees.response.dto';
import { EmployeesRepositoryImpl } from '../repositories/employee.repository.impl';


export class ListEmployeesController {

   readonly listEmployeesUseCase: ListEmployeesUseCase;

    constructor() {
        this.handle = this.handle.bind(this);
        this.listEmployeesUseCase = new ListEmployeesUseCase(new EmployeesRepositoryImpl());
    }

    async handle(req: Request, res: Response):Promise<any> {
        // 1. Validar el request con el DTO
        const listEmployeesRequestDTO = plainToClass(ListEmployeesRequestDTO, req.query);
        const errors = await validate(listEmployeesRequestDTO);

        if (errors.length > 0) {
            return res.status(400).json({ errors: errors.map(e => e.constraints) });
        }

        try {
            // 2. Llamar al caso de uso con paginación
            const { page, limit } = listEmployeesRequestDTO;
            const { employees, total } = await this.listEmployeesUseCase.execute(page || 1, limit || 10);

            // 3. Formatear la respuesta con el DTO de respuesta
             const listEmployeesResponseDTO:ListEmployeesResponseDTO[] = employees.map((employee) => ({
                _id: employee._id.toString(),
                first_name: employee.first_name,
                last_name: employee.last_name,
                email: employee.email,
                role: employee.role,
                active: employee.active,
                hire_date: employee.hire_date,
                created_at: employee.created_at,
                updated_at: employee.updated_at
             }))
                


            res.status(200).json({
                employees: listEmployeesResponseDTO,
                total,
                page: page || 1,
                limit: limit || 10
            });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
}
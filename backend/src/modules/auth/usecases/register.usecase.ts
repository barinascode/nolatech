import { hash } from 'bcrypt';
import RegisterRequestDTO from '../dto/register.request.dto';
import RegisterResponseDTO from '../dto/register.response.dto';
import { Types } from 'mongoose';
import { EmployeesRepository } from '../../../modules/employee/repositories/employee.repository';
import { EmployeeDocument } from '@/modules/employee/models/employee.model';

export default class RegisterUseCase {

  private employeeRepository: EmployeesRepository;

  constructor(employeeRepository: EmployeesRepository) {
    this.employeeRepository = employeeRepository;
  }

  async execute(data: RegisterRequestDTO): Promise<RegisterResponseDTO> {

    const existingUser = await this.employeeRepository.getEmployeeByEmail(data.email);

    if (existingUser) {
      throw new Error('El correo electrónico ya está en uso');
    }

    const passwordHash = await hash(data.password, 10);

    const newUser:Partial<EmployeeDocument> = {
      _id: new Types.ObjectId(),
      role: 'Employee',
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password: passwordHash,
      active: true,
      hire_date: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    };

    const userDocument = await this.employeeRepository.create(newUser);

    const userFormated = new RegisterResponseDTO({
      _id: userDocument._id.toString(),
      first_name: userDocument.first_name,
      last_name: userDocument.last_name,
      email: userDocument.email,
      role: userDocument.role
    });

    return userFormated;
  }

}
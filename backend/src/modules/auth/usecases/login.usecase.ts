
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { LoginResponse } from '@/shared/types/auth/auth.types';
import LoginResponseDTO from '../dto/login.response.dto';
import LoginRequestDTO from '../dto/login.request.dto';
import { EmployeesRepository } from '@/modules/employee/repositories/employee.repository';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export class LoginUseCase {
  private userRepository: EmployeesRepository;

  constructor(userRepository: EmployeesRepository) {
    this.userRepository = userRepository;
  }

  async execute(loginDTO: LoginRequestDTO): Promise<LoginResponse> {

    const employee = await this.userRepository.getEmployeeByEmail(loginDTO.email);

    if (!employee) throw new Error('Credenciales inválidas');
    
    const passwordMatch = await compare(loginDTO.password, employee.password); // Compara con passwordHash
    
    if (!passwordMatch) throw new Error('Credenciales inválidas');
    

    const payload = {
      email: employee.email,
      role: employee.role,
    };

    const token = sign(payload, JWT_SECRET, { expiresIn: '1h' });

     const formatedResul = new LoginResponseDTO({
              token: token,
              employee: {
                _id: employee._id.toString(),
                first_name: employee.first_name,
                last_name: employee.last_name,
                email: employee.email,
                role : employee.role,
                active: employee.active,
                hire_date: employee.hire_date,
                created_at: employee.created_at,
                updated_at: employee.updated_at
              }
            });

    return {
      token: formatedResul.data.token,
      employee: formatedResul.data.employee
    };
  }
  
}

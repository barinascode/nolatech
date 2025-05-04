import { Response, Request } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import RegisterUseCase from '../usecases/register.usecase';
import RegisterRequestDTO from '../dto/register.request.dto';
import { RegisterResponse } from '../../../shared/types/auth/auth.types';
import { EmployeesRepositoryImpl } from '../../../modules/employee/repositories/employee.repository.impl';

type FormattedErrors = {
  field: string;
  message: string;
};

export default class RegisterController {

  registerUseCase: RegisterUseCase;

  constructor() {

    this.registerUseCase = new RegisterUseCase(new EmployeesRepositoryImpl());
  }

  async register(req: Request, res: Response<RegisterResponse | Error | FormattedErrors[]>) {
    try {

      const registerDTO = plainToClass(RegisterRequestDTO, req.body);

      const errors: ValidationError[] = await validate(registerDTO);

      // Si hay errores, se formatea la respuesta y la envía
      if (errors.length > 0) {

        const formattedErrors = errors.map(error => ({

          field: error.property,

          message: error.constraints ? Object.values(error.constraints)[0] : 'Validación fallida'

        }));

        res.status(400).json(formattedErrors);

        return;
      }

      const employee = await this.registerUseCase.execute(registerDTO);

      res.status(201).json(employee.data);

    } catch (error:any) {

      if(error.message === 'El correo electrónico ya está en uso')
        res.status(409).send()
      else
        res.status(500).send();

    }

  }

}
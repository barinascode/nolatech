import { Response, Request } from 'express';
import { LoginUseCase } from '../usecases/login.usecase';

import LoginRequestDTO from '../dto/login.request.dto';
import LoginResponsetDTO from '../dto/login.response.dto';
import { LoginResponse } from '../../../shared/types/auth/auth.types';
import { validate, ValidationError } from 'class-validator';
import { EmployeesRepositoryImpl } from '../../../modules/employee/repositories/employee.repository.impl';

type FormattedErrors = {
  field: string;
  message: string;
};


export default class LoginController {
  
  readonly loginUseCase: LoginUseCase;
  
  constructor() {
    this.loginUseCase = new LoginUseCase(new EmployeesRepositoryImpl());

}

  async login(req: Request, res: Response<LoginResponse | Error | FormattedErrors[]>) {
    try {

      const loginDTO = new LoginRequestDTO();

      loginDTO.email = req.body.email;
      loginDTO.password = req.body.password;

      const errors: ValidationError[] = await validate(loginDTO);
      
            // Si hay errores, se formatea la respuesta y la envía
            if (errors.length > 0) {
      
              const formattedErrors = errors.map(error => ({
      
                field: error.property,
      
                message: error.constraints ? Object.values(error.constraints)[0] : 'Validación fallida'
      
              }));
      
              res.status(400).json(formattedErrors);
      
              return;
            }


      const result = await this.loginUseCase.execute(loginDTO);

      if(result){
        
        const extractedResult = new LoginResponsetDTO({
          token: result.token,
          employee: {
            _id: result.employee._id,
            first_name: result.employee.first_name,
            last_name: result.employee.last_name,
            email: result.employee.email,
            role : result.employee.role,
            active: result.employee.active,
            hire_date: result.employee.hire_date,
            created_at: result.employee.created_at,
            updated_at: result.employee.updated_at
          }
        });

        res.status(200).json(extractedResult.data);
      }
      

    } catch (error:any) {

      if(error.message === 'Credenciales inválidas')
        res.status(401).send();
      else
        res.status(500).send();

    }

  }

}
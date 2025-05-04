import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

const validateRequest = (dtoClass: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = plainToClass(dtoClass, req.body);
            const errors: ValidationError[] = await validate(dto);

            if (errors.length > 0) {
                const errorMessages = errors.map(error => ({
                    property: error.property,
                    constraints: error.constraints,
                }));
                res.status(400).json({ errors: errorMessages });
            } else {
                req.body = dto; // Sobrescribe el body con el DTO validado
                next();
            }
        } catch (error) {
            next(error);
        }
    };
};

export default validateRequest;
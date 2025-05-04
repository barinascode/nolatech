import { IsString, IsDate, IsArray, IsNotEmpty, IsMongoId, ArrayMinSize, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class QuestionDTO {
    @IsString()
    type: string;
    @IsString()
    text: string;
    @IsOptional()
    @IsString()
    competency?: string;
}

export class CreateEvaluationDTO {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsMongoId()
    @IsNotEmpty()
    employee_id: string;

    @IsArray()
    @ArrayMinSize(1)
    @IsMongoId({ each: true })
    evaluator_ids: string[];

    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    start_date: Date;

    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    end_date: Date;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => QuestionDTO)
    @IsNotEmpty()
    questions: QuestionDTO[];

    @IsMongoId()
    @IsNotEmpty()
    evaluated_id: string;

}

export class UpdateEvaluationDTO {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsArray()
    @ArrayMinSize(1)
    @IsMongoId({ each: true })
    evaluator_ids: string[];

    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    start_date: Date;

    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    end_date: Date;

    @IsString()
    status: string;

     @IsArray()
    @ValidateNested({ each: true })
    @Type(() => QuestionDTO)
    questions: QuestionDTO[];
}
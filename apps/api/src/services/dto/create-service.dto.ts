import { IsNotEmpty, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class CreateServiceDto {
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(1)
  @Max(60) /* minutes */
  duration: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999999)
  price?: number;
}

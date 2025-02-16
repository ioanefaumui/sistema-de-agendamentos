import { IsNotEmpty, IsNumber, Min, Max, IsString } from 'class-validator';

export class CreateServiceDto {
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(1)
  duration: number;

  @IsNumber()
  @Min(0)
  @Max(999999)
  price: number;

  @IsNotEmpty()
  @IsString()
  startTime: string;

  @IsNotEmpty()
  @IsString()
  endTime: string;
}

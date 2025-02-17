import { IsNotEmpty, IsUUID, IsDateString } from 'class-validator';

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsUUID()
  serviceId: string;

  @IsNotEmpty()
  @IsDateString()
  appointmentTime: string;
}

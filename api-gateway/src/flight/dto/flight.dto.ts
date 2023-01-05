import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FlightDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  pilot: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  airplane: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  destinationCity: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  flightDate: Date;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AbandonApplicationDto {
  @ApiProperty({ description: 'Motivo de abandono', example: 'Ya no requiere el crédito' })
  @IsString()
  @IsNotEmpty()
  reason!: string;
}

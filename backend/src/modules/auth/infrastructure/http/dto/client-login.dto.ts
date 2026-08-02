import { IsNotEmpty } from 'class-validator';

export class ClientLoginDto {
  @IsNotEmpty()
  documentNumber!: string;

  @IsNotEmpty()
  phone!: string;
}

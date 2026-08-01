import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateReferenceDto {
  @IsString()
  @IsOptional()
  label?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

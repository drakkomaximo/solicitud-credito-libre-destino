import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiCreatedEnvelope } from '@/common/decorators/api-responses.decorator';
import { ErrorResponseDto } from '@/common/dto/error-response.dto';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt-auth.guard';
import { SeedService } from '@/modules/seed/application/services/seed.service';

@ApiBearerAuth()
@ApiTags('Seed')
@UseGuards(JwtAuthGuard)
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  @ApiOperation({ summary: 'Poblar datos de prueba', description: 'Crea registros de prueba solo si la base de datos está vacía. Requiere token JWT de administrador.' })
  @ApiCreatedEnvelope('Datos de prueba poblados')
  @ApiResponse({ status: 401, description: 'Token faltante, inválido o expirado', type: ErrorResponseDto })
  async seed() {
    return await this.seedService.populate();
  }
}

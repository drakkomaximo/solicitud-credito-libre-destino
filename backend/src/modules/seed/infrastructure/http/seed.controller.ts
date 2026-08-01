import { Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiCreatedEnvelope } from '@/common/decorators/api-responses.decorator';
import { ErrorResponseDto } from '@/common/dto/error-response.dto';
import { SeedService } from '@/modules/seed/application/services/seed.service';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  @ApiOperation({ summary: 'Poblar datos de prueba', description: 'Crea registros de prueba solo si la base de datos está vacía.' })
  @ApiCreatedEnvelope('Datos de prueba poblados')
  @ApiResponse({ status: 409, description: 'La base de datos ya contiene solicitudes', type: ErrorResponseDto })
  async seed() {
    return await this.seedService.populate();
  }
}

import { Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SeedService } from '@/modules/seed/application/services/seed.service';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  @ApiOperation({ summary: 'Poblar datos de prueba', description: 'Crea registros de prueba solo si la base de datos está vacía.' })
  @ApiResponse({ status: 201, description: 'Datos de prueba poblados' })
  @ApiResponse({ status: 200, description: 'No se poblaron porque ya existen datos' })
  async seed() {
    return await this.seedService.populate();
  }
}

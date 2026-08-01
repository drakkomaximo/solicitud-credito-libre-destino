import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReferencesService } from '@/modules/references/application/services/references.service';

@ApiTags('Dominios')
@Controller('applications')
export class EnumsController {
  constructor(private readonly referencesService: ReferencesService) {}

  @Get('enums')
  @ApiOperation({
    summary: 'Listar enumeraciones del dominio',
    description: 'Devuelve los valores activos para status, channel y documentType. Útil para poblar listas desplegables en el frontend.',
  })
  @ApiResponse({ status: 200, description: 'Enumeraciones obtenidas exitosamente' })
  async getEnums() {
    return this.referencesService.getEnums();
  }
}

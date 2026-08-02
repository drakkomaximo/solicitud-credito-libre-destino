import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiOkEnvelope } from '@/common/decorators/api-responses.decorator';
import { ReferencesService } from '@/modules/references/application/services/references.service';

@ApiTags('Dominios')
@Controller('applications')
export class EnumsController {
  constructor(private readonly referencesService: ReferencesService) {}

  @Get('enums')
  @ApiOperation({
    summary: 'Listar enumeraciones del dominio',
    description:
      'Devuelve de forma dinámica los códigos activos agrupados por dominio. Cada clave del objeto es un dominio existente y su valor es un array de codes activos.',
  })
  @ApiOkEnvelope('Enumeraciones obtenidas exitosamente')
  async getEnums() {
    return this.referencesService.getEnums();
  }
}

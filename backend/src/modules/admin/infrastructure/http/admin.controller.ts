import { Body, Controller, ForbiddenException, Get, Headers, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBody, ApiHeader, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiOkEnvelope, ApiCreatedEnvelope, ApiPaginatedEnvelope } from '@/common/decorators/api-responses.decorator';
import { ErrorResponseDto } from '@/common/dto/error-response.dto';
import { AdminService } from '@/modules/admin/application/services/admin.service';
import { ReferencesService } from '@/modules/references/application/services/references.service';
import { EventsService } from '@/modules/events/application/services/events.service';
import { CreateReferenceDto } from './dto/create-reference.dto';
import { UpdateReferenceDto } from './dto/update-reference.dto';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly referencesService: ReferencesService,
    private readonly eventsService: EventsService,
  ) {}

  @Post('database/clean')
  @ApiOperation({ summary: 'Limpiar base de datos', description: 'Elimina los registros de solicitudes. Solo disponible en ambiente local con la clave administrativa correcta.' })
  @ApiHeader({ name: 'x-admin-secret', description: 'Clave secreta de administrador', required: true })
  @ApiCreatedEnvelope('Base de datos limpiada')
  @ApiResponse({ status: 403, description: 'Clave faltante, incorrecta o ambiente no permitido', type: ErrorResponseDto })
  async cleanDatabase(@Headers('x-admin-secret') secret: string) {
    if (!secret) {
      throw new ForbiddenException('Se requiere el header x-admin-secret');
    }
    const result = await this.adminService.cleanDatabase(secret);
    this.eventsService.emit({ type: 'database.cleaned', payload: { source: 'admin' } });
    return result;
  }

  @Get('references')
  @ApiOperation({ summary: 'Listar referencias de dominio', description: 'Devuelve los valores de referencia paginados por cursor. Permite filtrar por dominio.' })
  @ApiQuery({ name: 'domain', required: false, description: 'Dominio a filtrar' })
  @ApiQuery({ name: 'cursor', required: false, description: 'Cursor de paginación' })
  @ApiQuery({ name: 'limit', required: false, description: 'Cantidad de resultados (máx. 100)' })
  @ApiPaginatedEnvelope('Referencias obtenidas')
  async listReferences(
    @Query('domain') domain?: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    return this.referencesService.list({
      domain,
      cursor,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get('references/:id')
  @ApiOperation({ summary: 'Obtener una referencia por ID', description: 'Devuelve el detalle de una referencia de dominio.' })
  @ApiOkEnvelope('Referencia obtenida')
  async getReference(@Param('id') id: string) {
    return this.referencesService.findById(id);
  }

  @Post('references')
  @ApiOperation({ summary: 'Crear una referencia de dominio', description: 'Crea un nuevo valor dentro de un dominio. El par domain+code debe ser único.' })
  @ApiBody({ type: CreateReferenceDto })
  @ApiCreatedEnvelope('Referencia creada')
  async createReference(@Body() dto: CreateReferenceDto) {
    const ref = await this.referencesService.create(dto);
    this.eventsService.emit({ type: 'reference.created', payload: { id: ref.id, domain: ref.domain, code: ref.code } });
    return ref;
  }

  @Patch('references/:id')
  @ApiOperation({ summary: 'Actualizar una referencia', description: 'Permite modificar el label, la descripción o el estado activo de una referencia existente.' })
  @ApiBody({ type: UpdateReferenceDto })
  @ApiOkEnvelope('Referencia actualizada')
  async updateReference(@Param('id') id: string, @Body() dto: UpdateReferenceDto) {
    const ref = await this.referencesService.update(id, dto);
    this.eventsService.emit({ type: 'reference.updated', payload: { id: ref.id, domain: ref.domain, code: ref.code } });
    return ref;
  }

  @Post('references/:id/toggle')
  @ApiOperation({ summary: 'Activar o desactivar una referencia', description: 'Invierte el valor del campo isActive. Útil para deshabilitar valores sin borrarlos.' })
  @ApiOkEnvelope('Estado cambiado')
  async toggleReference(@Param('id') id: string) {
    const ref = await this.referencesService.toggle(id);
    this.eventsService.emit({ type: 'reference.toggled', payload: { id: ref.id, domain: ref.domain, code: ref.code, isActive: ref.isActive } });
    return ref;
  }
}

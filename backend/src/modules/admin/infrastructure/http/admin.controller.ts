import { Body, Controller, ForbiddenException, Get, Headers, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBody, ApiHeader, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminService } from '@/modules/admin/application/services/admin.service';
import { ReferencesService } from '@/modules/references/application/services/references.service';
import { CreateReferenceDto } from './dto/create-reference.dto';
import { UpdateReferenceDto } from './dto/update-reference.dto';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly referencesService: ReferencesService,
  ) {}

  @Post('database/clean')
  @ApiOperation({ summary: 'Limpiar base de datos', description: 'Elimina los registros de solicitudes. Solo disponible en ambiente local con la clave administrativa correcta.' })
  @ApiHeader({ name: 'x-admin-secret', description: 'Clave secreta de administrador', required: true })
  @ApiResponse({ status: 201, description: 'Base de datos limpiada' })
  @ApiResponse({ status: 403, description: 'Clave faltante, incorrecta o ambiente no permitido' })
  async cleanDatabase(@Headers('x-admin-secret') secret: string) {
    if (!secret) {
      throw new ForbiddenException('Se requiere el header x-admin-secret');
    }
    return await this.adminService.cleanDatabase(secret);
  }

  @Get('references')
  @ApiOperation({ summary: 'Listar referencias de dominio', description: 'Devuelve los valores de referencia paginados por cursor. Permite filtrar por dominio.' })
  @ApiQuery({ name: 'domain', required: false, description: 'Dominio a filtrar' })
  @ApiQuery({ name: 'cursor', required: false, description: 'Cursor de paginación' })
  @ApiQuery({ name: 'limit', required: false, description: 'Cantidad de resultados (máx. 100)' })
  @ApiResponse({ status: 200, description: 'Referencias obtenidas' })
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
  @ApiResponse({ status: 200, description: 'Referencia obtenida' })
  @ApiResponse({ status: 404, description: 'Referencia no encontrada' })
  async getReference(@Param('id') id: string) {
    return this.referencesService.findById(id);
  }

  @Post('references')
  @ApiOperation({ summary: 'Crear una referencia de dominio', description: 'Crea un nuevo valor dentro de un dominio. El par domain+code debe ser único.' })
  @ApiBody({ type: CreateReferenceDto })
  @ApiResponse({ status: 201, description: 'Referencia creada' })
  async createReference(@Body() dto: CreateReferenceDto) {
    return this.referencesService.create(dto);
  }

  @Patch('references/:id')
  @ApiOperation({ summary: 'Actualizar una referencia', description: 'Permite modificar el label, la descripción o el estado activo de una referencia existente.' })
  @ApiBody({ type: UpdateReferenceDto })
  @ApiResponse({ status: 200, description: 'Referencia actualizada' })
  @ApiResponse({ status: 404, description: 'Referencia no encontrada' })
  async updateReference(@Param('id') id: string, @Body() dto: UpdateReferenceDto) {
    return this.referencesService.update(id, dto);
  }

  @Post('references/:id/toggle')
  @ApiOperation({ summary: 'Activar o desactivar una referencia', description: 'Invierte el valor del campo isActive. Útil para deshabilitar valores sin borrarlos.' })
  @ApiResponse({ status: 200, description: 'Estado cambiado' })
  @ApiResponse({ status: 404, description: 'Referencia no encontrada' })
  async toggleReference(@Param('id') id: string) {
    return this.referencesService.toggle(id);
  }
}

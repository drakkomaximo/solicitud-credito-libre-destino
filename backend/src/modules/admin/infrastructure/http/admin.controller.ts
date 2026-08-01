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
  @ApiOperation({ summary: 'Listar referencias de dominio', description: 'Devuelve los valores de referencia. Permite filtrar por dominio.' })
  @ApiQuery({ name: 'domain', required: false, description: 'Dominio a filtrar' })
  @ApiResponse({ status: 200, description: 'Referencias obtenidas' })
  async listReferences(@Query('domain') domain?: string) {
    if (domain) {
      return this.referencesService.getByDomain(domain, false);
    }
    return this.referencesService.findAll();
  }

  @Post('references')
  @ApiOperation({ summary: 'Crear una referencia de dominio', description: 'Agrega un nuevo valor a un dominio.' })
  @ApiBody({ type: CreateReferenceDto })
  @ApiResponse({ status: 201, description: 'Referencia creada' })
  async createReference(@Body() dto: CreateReferenceDto) {
    return this.referencesService.create(dto);
  }

  @Patch('references/:id')
  @ApiOperation({ summary: 'Actualizar una referencia', description: 'Permite cambiar label, descripción o estado activo.' })
  @ApiBody({ type: UpdateReferenceDto })
  @ApiResponse({ status: 200, description: 'Referencia actualizada' })
  @ApiResponse({ status: 404, description: 'Referencia no encontrada' })
  async updateReference(@Param('id') id: string, @Body() dto: UpdateReferenceDto) {
    return this.referencesService.update(id, dto);
  }

  @Post('references/:id/toggle')
  @ApiOperation({ summary: 'Activar o desactivar una referencia', description: 'Cambia el campo isActive de la referencia.' })
  @ApiResponse({ status: 200, description: 'Estado cambiado' })
  @ApiResponse({ status: 404, description: 'Referencia no encontrada' })
  async toggleReference(@Param('id') id: string) {
    return this.referencesService.toggle(id);
  }
}

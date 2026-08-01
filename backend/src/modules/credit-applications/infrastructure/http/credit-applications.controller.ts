import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { ListApplicationsQuery } from '@/modules/credit-applications/application/services/credit-applications.service';
import { CreditApplicationsService } from '@/modules/credit-applications/application/services/credit-applications.service';
import { ApplicationStatus, ApplicationChannel, DocumentType } from '@/modules/credit-applications/domain/credit-application.enums';
import { CreateApplicationDto } from '@/modules/credit-applications/infrastructure/http/dto/create-application.dto';
import { UpdateApplicationDto } from '@/modules/credit-applications/infrastructure/http/dto/update-application.dto';
import { AbandonApplicationDto } from '@/modules/credit-applications/infrastructure/http/dto/abandon-application.dto';

@ApiTags('Solicitudes de crédito')
@Controller('applications')
export class CreditApplicationsController {
  constructor(private readonly service: CreditApplicationsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una solicitud de crédito', description: 'Registra una nueva solicitud en estado DRAFT.' })
  @ApiResponse({ status: 201, description: 'Solicitud creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  async create(@Body() dto: CreateApplicationDto) {
    return await this.service.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar solicitudes de crédito',
    description: 'Listado paginado por cursor (keyset) con filtros opcionales de status, channel y búsqueda libre.',
  })
  @ApiQuery({ name: 'status', required: false, enum: Object.values(ApplicationStatus), description: 'Filtrar por estado de la solicitud' })
  @ApiQuery({ name: 'channel', required: false, enum: Object.values(ApplicationChannel), description: 'Filtrar por canal de atención' })
  @ApiQuery({ name: 'q', required: false, description: 'Texto de búsqueda libre sobre documento, nombre o apellido' })
  @ApiQuery({ name: 'cursor', required: false, type: String, description: 'Cursor para paginación basada en id (el id del último registro visto)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Tamaño de página (default 10, máx 100)' })
  @ApiResponse({ status: 200, description: 'Listado obtenido exitosamente' })
  @ApiResponse({ status: 400, description: 'Parámetros de consulta inválidos' })
  list(
    @Query('status') status?: string,
    @Query('channel') channel?: string,
    @Query('q') q?: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    const query: ListApplicationsQuery = { status, channel, q };
    if (cursor !== undefined) query.cursor = cursor;
    if (limit !== undefined) query.limit = parseInt(limit, 10);
    return this.service.list(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una solicitud por id' })
  @ApiResponse({ status: 200, description: 'Solicitud encontrada' })
  @ApiResponse({ status: 404, description: 'Solicitud no encontrada' })
  async getById(@Param('id') id: string) {
    return await this.service.getById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una solicitud', description: 'Permite modificar los datos mientras la solicitud esté en estado DRAFT.' })
  @ApiResponse({ status: 200, description: 'Solicitud actualizada' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o la solicitud no permite edición' })
  @ApiResponse({ status: 404, description: 'Solicitud no encontrada' })
  async update(@Param('id') id: string, @Body() dto: UpdateApplicationDto) {
    return await this.service.update(id, dto);
  }

  @Post(':id/simulate-offer')
  @ApiOperation({ summary: 'Simular oferta de crédito', description: 'Calcula la oferta de acuerdo a la capacidad de pago del solicitante.' })
  @ApiResponse({ status: 200, description: 'Oferta simulada' })
  @ApiResponse({ status: 400, description: 'No se puede simular la oferta' })
  @ApiResponse({ status: 404, description: 'Solicitud no encontrada' })
  async simulateOffer(@Param('id') id: string) {
    return await this.service.simulateOffer(id);
  }

  @Post(':id/finalize')
  @ApiOperation({ summary: 'Finalizar una solicitud' })
  @ApiResponse({ status: 200, description: 'Solicitud finalizada' })
  @ApiResponse({ status: 400, description: 'No se puede finalizar la solicitud' })
  @ApiResponse({ status: 404, description: 'Solicitud no encontrada' })
  async finalize(@Param('id') id: string) {
    return await this.service.finalize(id);
  }

  @Post(':id/abandon')
  @ApiOperation({ summary: 'Abandonar una solicitud' })
  @ApiResponse({ status: 200, description: 'Solicitud abandonada' })
  @ApiResponse({ status: 400, description: 'No se puede abandonar la solicitud' })
  @ApiResponse({ status: 404, description: 'Solicitud no encontrada' })
  async abandon(@Param('id') id: string, @Body() dto: AbandonApplicationDto) {
    return await this.service.abandon(id, dto);
  }

  @Get(':id/events')
  @ApiOperation({ summary: 'Consultar eventos de una solicitud' })
  @ApiResponse({ status: 200, description: 'Eventos obtenidos' })
  @ApiResponse({ status: 404, description: 'Solicitud no encontrada' })
  async getEvents(@Param('id') id: string) {
    return await this.service.getEvents(id);
  }
}

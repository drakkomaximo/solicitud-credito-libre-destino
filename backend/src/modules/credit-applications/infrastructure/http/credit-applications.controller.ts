import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  ApiOkEnvelope,
  ApiCreatedEnvelope,
  ApiPaginatedEnvelope,
} from '@/common/decorators/api-responses.decorator';
import { ErrorResponseDto } from '@/common/dto/error-response.dto';
import type { ListApplicationsQuery } from '@/modules/credit-applications/application/services/credit-applications.service';
import { CreditApplicationsService } from '@/modules/credit-applications/application/services/credit-applications.service';
import { AuthService } from '@/modules/auth/application/services/auth.service';
import { ApplicationOrAdminGuard } from '@/modules/auth/infrastructure/guards/application-or-admin.guard';
import {
  ApplicationStatus,
  ApplicationChannel,
  DocumentType,
} from '@/modules/credit-applications/domain/credit-application.enums';
import { CreateApplicationDto } from '@/modules/credit-applications/infrastructure/http/dto/create-application.dto';
import { UpdateApplicationDto } from '@/modules/credit-applications/infrastructure/http/dto/update-application.dto';
import { AbandonApplicationDto } from '@/modules/credit-applications/infrastructure/http/dto/abandon-application.dto';
import { LookupApplicationDto } from '@/modules/credit-applications/infrastructure/http/dto/lookup-application.dto';

@ApiTags('Solicitudes de crédito')
@Controller('applications')
export class CreditApplicationsController {
  constructor(
    private readonly service: CreditApplicationsService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Crear una solicitud de crédito',
    description:
      'Registra una nueva solicitud en estado DRAFT. Devuelve la solicitud junto con un token de acceso para los siguientes pasos.',
  })
  @ApiCreatedEnvelope('Solicitud creada exitosamente')
  async create(@Body() dto: CreateApplicationDto) {
    const application = await this.service.create(dto);
    const accessToken = this.authService.generateApplicationToken(
      application.id,
    );
    return { ...application, accessToken };
  }

  @Get('lookup')
  @ApiOperation({
    summary: 'Buscar solicitud en borrador',
    description:
      'Busca una solicitud DRAFT por número de documento y teléfono. Devuelve la solicitud con un nuevo token de acceso para retomarla.',
  })
  @ApiOkEnvelope('Solicitud encontrada')
  @ApiResponse({
    status: 404,
    description: 'No se encontró solicitud en borrador con esos datos',
    type: ErrorResponseDto,
  })
  async lookup(@Query() query: LookupApplicationDto) {
    const application = await this.service.lookup(
      query.documentNumber,
      query.phone,
    );
    if (!application) {
      throw new NotFoundException(
        'No se encontró solicitud en borrador con esos datos',
      );
    }
    const accessToken = this.authService.generateApplicationToken(
      application.id,
    );
    return { ...application, accessToken };
  }

  @Get()
  @UseGuards(ApplicationOrAdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar solicitudes de crédito',
    description:
      'Listado paginado por cursor (keyset) con filtros opcionales. Administradores ven todo; clientes solo ven sus propias solicitudes.',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: Object.values(ApplicationStatus),
    description: 'Filtrar por estado de la solicitud',
  })
  @ApiQuery({
    name: 'channel',
    required: false,
    enum: Object.values(ApplicationChannel),
    description: 'Filtrar por canal de atención',
  })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Texto de búsqueda libre sobre documento, nombre o apellido',
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    type: String,
    description:
      'Cursor para paginación basada en id (el id del último registro visto)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Tamaño de página (default 10, máx 100)',
  })
  @ApiPaginatedEnvelope('Listado obtenido exitosamente')
  @ApiResponse({
    status: 401,
    description: 'Token faltante, inválido o expirado',
    type: ErrorResponseDto,
  })
  list(
    @Req()
    req: { user?: { role?: string; documentNumber?: string; phone?: string } },
    @Query('status') status?: string,
    @Query('channel') channel?: string,
    @Query('q') q?: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    const query: ListApplicationsQuery = { status, channel, q };
    if (cursor !== undefined) query.cursor = cursor;
    if (limit !== undefined) query.limit = parseInt(limit, 10);
    if (req.user?.role === 'client') {
      query.documentNumber = req.user.documentNumber;
      query.phone = req.user.phone;
    }
    return this.service.list(query);
  }

  @Get(':id')
  @UseGuards(ApplicationOrAdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener una solicitud por id',
    description:
      'Devuelve el detalle completo de una solicitud. Requiere el token de la solicitud o JWT de administrador.',
  })
  @ApiOkEnvelope('Solicitud encontrada')
  @ApiResponse({
    status: 401,
    description: 'Token faltante, inválido o expirado',
    type: ErrorResponseDto,
  })
  async getById(@Param('id') id: string) {
    return await this.service.getById(id);
  }

  @Patch(':id')
  @UseGuards(ApplicationOrAdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Actualizar una solicitud',
    description:
      'Actualiza los datos complementarios. Requiere el token de la solicitud o JWT de administrador. Solo permite edición mientras esté en estado DRAFT.',
  })
  @ApiOkEnvelope('Solicitud actualizada')
  @ApiResponse({
    status: 401,
    description: 'Token faltante, inválido o expirado',
    type: ErrorResponseDto,
  })
  async update(@Param('id') id: string, @Body() dto: UpdateApplicationDto) {
    return await this.service.update(id, dto);
  }

  @Post(':id/simulate-offer')
  @UseGuards(ApplicationOrAdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Simular oferta de crédito',
    description:
      'Calcula la oferta. Requiere el token de la solicitud o JWT de administrador.',
  })
  @ApiOkEnvelope('Oferta simulada')
  @ApiResponse({
    status: 401,
    description: 'Token faltante, inválido o expirado',
    type: ErrorResponseDto,
  })
  async simulateOffer(@Param('id') id: string) {
    return await this.service.simulateOffer(id);
  }

  @Post(':id/finalize')
  @UseGuards(ApplicationOrAdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Finalizar una solicitud',
    description:
      'Cambia el estado a PENDING_VALIDATION. Requiere el token de la solicitud o JWT de administrador.',
  })
  @ApiOkEnvelope('Solicitud finalizada')
  @ApiResponse({
    status: 401,
    description: 'Token faltante, inválido o expirado',
    type: ErrorResponseDto,
  })
  async finalize(@Param('id') id: string) {
    return await this.service.finalize(id);
  }

  @Post(':id/abandon')
  @UseGuards(ApplicationOrAdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Abandonar una solicitud',
    description:
      'Registra el abandono. Requiere el token de la solicitud o JWT de administrador.',
  })
  @ApiOkEnvelope('Solicitud abandonada')
  @ApiResponse({
    status: 401,
    description: 'Token faltante, inválido o expirado',
    type: ErrorResponseDto,
  })
  async abandon(@Param('id') id: string, @Body() dto: AbandonApplicationDto) {
    return await this.service.abandon(id, dto);
  }

  @Get(':id/events')
  @UseGuards(ApplicationOrAdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Consultar eventos de una solicitud',
    description:
      'Devuelve la trazabilidad. Requiere el token de la solicitud o JWT de administrador.',
  })
  @ApiOkEnvelope('Eventos obtenidos')
  @ApiResponse({
    status: 401,
    description: 'Token faltante, inválido o expirado',
    type: ErrorResponseDto,
  })
  async getEvents(@Param('id') id: string) {
    return await this.service.getEvents(id);
  }
}

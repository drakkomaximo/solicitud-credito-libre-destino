import { BadRequestException, Inject, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { CreditApplication } from '@/modules/credit-applications/domain/entities/credit-application';
import type { ApplicationListFilters, ApplicationListQuery, ICreditApplicationRepository } from '@/modules/credit-applications/domain/repositories/credit-application.repository';
import { CreateApplicationUseCase } from '@/modules/credit-applications/application/use-cases/create-application/create-application.use-case';
import { ReferencesService } from '@/modules/references/application/services/references.service';
import type { CreateApplicationCommand } from '@/modules/credit-applications/application/use-cases/create-application/create-application.command';

export interface ListApplicationsQuery extends ApplicationListQuery {}

export interface ListApplicationsResult {
  data: CreditApplication[];
  nextCursor: string | null;
  hasNextPage: boolean;
  limit: number;
}

export interface UpdateApplicationCommand {
  income?: number;
  expenses?: number;
  amount?: number;
  term?: number;
  purpose?: string;
  dataAuthorized?: boolean;
}

export interface AbandonApplicationCommand {
  reason: string;
}

export interface SimulationResult {
  status: 'approved' | 'not-viable' | 'error';
  message?: string;
  monthlyPayment?: number;
  totalPayment?: number;
  interestRate?: number;
}

@Injectable()
export class CreditApplicationsService {
  constructor(
    @Inject('CreditApplicationRepository') private readonly repository: ICreditApplicationRepository,
    private readonly createApplicationUseCase: CreateApplicationUseCase,
    private readonly referencesService: ReferencesService,
  ) {}

  private async validateTerm(term: number): Promise<void> {
    const refs = await this.referencesService.getByDomain('credit-term');
    if (!refs.some((r) => r.code === String(term))) {
      throw new BadRequestException(`El plazo ${term} meses no está permitido`);
    }
  }

  async create(command: CreateApplicationCommand): Promise<CreditApplication> {
    return this.createApplicationUseCase.execute(command);
  }

  async getById(id: string): Promise<CreditApplication> {
    const application = await this.repository.findById(id);
    if (!application) throw new NotFoundException(`Solicitud ${id} no encontrada`);
    return application;
  }

  async list(query: ListApplicationsQuery = {}): Promise<ListApplicationsResult> {
    const limit = Math.min(query.limit ?? 10, 100);
    const filters: ApplicationListFilters = { status: query.status, channel: query.channel, q: query.q };

    const apps = await this.repository.findAll({ ...filters, cursor: query.cursor, limit });
    const hasNextPage = apps.length > limit;
    const data = hasNextPage ? apps.slice(0, limit) : apps;
    const nextCursor = data.length > 0 ? data[data.length - 1].id : null;

    return { data, nextCursor, hasNextPage, limit };
  }

  async update(id: string, command: UpdateApplicationCommand): Promise<CreditApplication> {
    const application = await this.getById(id);
    if (application.status !== 'DRAFT') {
      throw new BadRequestException('Solo se puede editar una solicitud en estado DRAFT');
    }

    if (command.term !== undefined) {
      await this.validateTerm(command.term);
      application.term = command.term;
    }
    if (command.income !== undefined) application.income = command.income;
    if (command.expenses !== undefined) application.expenses = command.expenses;
    if (command.amount !== undefined) application.amount = command.amount;
    if (command.purpose !== undefined) application.purpose = command.purpose;
    if (command.dataAuthorized !== undefined) application.dataAuthorized = command.dataAuthorized;

    application.updatedAt = new Date();

    if (Object.values(command).some((value) => value !== undefined)) {
      application.recordEvent('UPDATED');
    }

    await this.repository.update(application);
    return application;
  }

  async lookup(documentNumber: string, phone: string): Promise<CreditApplication | null> {
    const applications = await this.repository.findByDocumentNumber(documentNumber);
    const draft = applications
      .filter((a) => a.status === 'DRAFT' && a.phone === phone)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
    return draft ?? null;
  }

  async simulateOffer(id: string): Promise<SimulationResult> {
    const application = await this.getById(id);
    if (application.status !== 'DRAFT') {
      throw new BadRequestException('La simulación solo aplica a solicitudes en estado DRAFT');
    }

    if (application.term > 120) {
      throw new ServiceUnavailableException('Error técnico temporal en la simulación. Intente más tarde.');
    }

    if (application.amount > application.income * 3 || application.amount <= 0) {
      application.status = 'NOT_VIABLE';
      application.recordEvent('SIMULATED');
      await this.repository.update(application);
      return { status: 'not-viable', message: 'La solicitud no es viable con los datos actuales' };
    }

    const rate = 0.015;
    const monthlyPayment = (application.amount * rate) / (1 - Math.pow(1 + rate, -application.term));
    const totalPayment = monthlyPayment * application.term;

    application.recordEvent('SIMULATED');
    await this.repository.update(application);
    return {
      status: 'approved',
      monthlyPayment: Math.round(monthlyPayment),
      totalPayment: Math.round(totalPayment),
      interestRate: rate,
    };
  }

  async finalize(id: string): Promise<CreditApplication> {
    const application = await this.getById(id);
    if (application.status === 'NOT_VIABLE' || application.status === 'ABANDONED') {
      throw new BadRequestException('No se puede finalizar una solicitud en este estado');
    }
    application.status = 'PENDING_VALIDATION';
    application.recordEvent('FINALIZED');
    await this.repository.update(application);
    return application;
  }

  async abandon(id: string, command: AbandonApplicationCommand): Promise<CreditApplication> {
    const application = await this.getById(id);
    if (application.status === 'FINALIZED' || application.status === 'PENDING_VALIDATION') {
      throw new BadRequestException('No se puede abandonar una solicitud finalizada');
    }
    application.status = 'ABANDONED';
    application.recordEvent('ABANDONED', { reason: command.reason });
    await this.repository.update(application);
    return application;
  }

  async getEvents(id: string): Promise<CreditApplication['events']> {
    const application = await this.getById(id);
    return application.events;
  }
}

import {
  BadRequestException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreditApplication } from '@/modules/credit-applications/domain/entities/credit-application';
import type { ICreditApplicationRepository } from '@/modules/credit-applications/domain/repositories/credit-application.repository';
import { CreateApplicationUseCase } from '@/modules/credit-applications/application/use-cases/create-application/create-application.use-case';
import { CreditApplicationsService } from '@/modules/credit-applications/application/services/credit-applications.service';
import { ReferencesService } from '@/modules/references/application/services/references.service';

describe('CreditApplicationsService', () => {
  let service: CreditApplicationsService;
  let repository: jest.Mocked<ICreditApplicationRepository>;
  let useCase: { execute: jest.Mock };

  const makeApp = (
    overrides: Partial<CreditApplication> = {},
  ): CreditApplication => {
    const app = new CreditApplication({
      id: 'app-1',
      channel: 'self-service',
      documentType: 'CC',
      documentNumber: '123456',
      firstName: 'Juan',
      lastName: 'Pérez',
      phone: '300',
      email: 'juan@test.com',
      city: 'Bogotá',
      status: 'DRAFT',
      ...overrides,
    });
    return app;
  };

  beforeEach(async () => {
    repository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      count: jest.fn(),
      save: jest.fn(),
      update: jest.fn().mockImplementation((a) => Promise.resolve(a)),
    } as any;

    useCase = { execute: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreditApplicationsService,
        { provide: 'CreditApplicationRepository', useValue: repository },
        { provide: CreateApplicationUseCase, useValue: useCase },
        {
          provide: ReferencesService,
          useValue: {
            getByDomain: jest.fn().mockResolvedValue([{ code: '12' }]),
            getById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(CreditApplicationsService);
  });

  it('debería crear mediante el caso de uso', async () => {
    const created = makeApp();
    useCase.execute.mockResolvedValue(created);
    const result = await service.create({ channel: 'self-service' } as any);
    expect(result).toBe(created);
    expect(useCase.execute).toHaveBeenCalledWith({ channel: 'self-service' });
  });

  it('debería obtener por id o lanzar NotFoundException', async () => {
    const app = makeApp();
    repository.findById.mockResolvedValue(app);
    const result = await service.getById('app-1');
    expect(result).toBe(app);

    repository.findById.mockResolvedValue(null);
    await expect(service.getById('app-2')).rejects.toThrow(NotFoundException);
  });

  it('debería listar con cursor y filtros', async () => {
    const apps = [makeApp()];
    repository.findAll.mockResolvedValue(apps);
    const result = await service.list({
      status: 'DRAFT',
      channel: 'self-service',
      q: 'Juan',
    });
    expect(result.data).toBe(apps);
    expect(result.nextCursor).toBe('app-1');
    expect(result.hasNextPage).toBe(false);
    expect(result.limit).toBe(10);
    expect(repository.findAll).toHaveBeenCalledWith({
      status: 'DRAFT',
      channel: 'self-service',
      q: 'Juan',
      cursor: undefined,
      limit: 10,
    });
  });

  it('no debería actualizar si no está en DRAFT', async () => {
    repository.findById.mockResolvedValue(makeApp({ status: 'FINALIZED' }));
    await expect(
      service.update('app-1', {
        income: 1,
        expenses: 0,
        amount: 100,
        term: 12,
        purpose: 'test',
        dataAuthorized: true,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('debería actualizar los datos y registrar evento', async () => {
    const app = makeApp({ status: 'DRAFT' });
    repository.findById.mockResolvedValue(app);
    const result = await service.update('app-1', {
      income: 2000,
      expenses: 500,
      amount: 5000,
      term: 12,
      purpose: 'viaje',
      dataAuthorized: true,
    });
    expect(result.income).toBe(2000);
    expect(result.purpose).toBe('viaje');
    expect(result.events.some((e) => e.type === 'UPDATED')).toBe(true);
    expect(repository.update).toHaveBeenCalled();
  });

  it('debería marcar NO viable cuando el monto excede 3x ingresos', async () => {
    const app = makeApp({ income: 1000, amount: 4000, status: 'DRAFT' });
    repository.findById.mockResolvedValue(app);
    const result = await service.simulateOffer('app-1');
    expect(result.status).toBe('not-viable');
    expect(app.status).toBe('NOT_VIABLE');
  });

  it('debería calcular oferta aprobada', async () => {
    const app = makeApp({
      income: 5000,
      amount: 5000,
      term: 12,
      status: 'DRAFT',
    });
    repository.findById.mockResolvedValue(app);
    const result = await service.simulateOffer('app-1');
    expect(result.status).toBe('approved');
    expect(result.monthlyPayment).toBeGreaterThan(0);
    expect(result.totalPayment).toBeGreaterThan(0);
  });

  it('debería lanzar error técnico si plazo > 120', async () => {
    const app = makeApp({ term: 150, status: 'DRAFT' });
    repository.findById.mockResolvedValue(app);
    await expect(service.simulateOffer('app-1')).rejects.toThrow(
      ServiceUnavailableException,
    );
  });

  it('debería finalizar a PENDING_VALIDATION', async () => {
    const app = makeApp({ status: 'DRAFT' });
    repository.findById.mockResolvedValue(app);
    const result = await service.finalize('app-1');
    expect(result.status).toBe('PENDING_VALIDATION');
    expect(result.events.some((e) => e.type === 'FINALIZED')).toBe(true);
  });

  it('no debería finalizar si no es viable', async () => {
    repository.findById.mockResolvedValue(makeApp({ status: 'NOT_VIABLE' }));
    await expect(service.finalize('app-1')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('debería abandonar y guardar motivo', async () => {
    const app = makeApp({ status: 'DRAFT' });
    repository.findById.mockResolvedValue(app);
    const result = await service.abandon('app-1', {
      reason: 'ya no requiere crédito',
    });
    expect(result.status).toBe('ABANDONED');
    expect(result.events.some((e) => e.type === 'ABANDONED')).toBe(true);
  });

  it('no debería abandonar si ya está finalizada', async () => {
    repository.findById.mockResolvedValue(makeApp({ status: 'FINALIZED' }));
    await expect(service.abandon('app-1', { reason: 'x' })).rejects.toThrow(
      BadRequestException,
    );
  });

  it('debería retornar eventos', async () => {
    const app = makeApp({ status: 'DRAFT' });
    app.recordEvent('CREATED');
    repository.findById.mockResolvedValue(app);
    const events = await service.getEvents('app-1');
    expect(events.length).toBeGreaterThan(0);
  });
});

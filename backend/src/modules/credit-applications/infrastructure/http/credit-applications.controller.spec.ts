import { Test, TestingModule } from '@nestjs/testing';
import { CreditApplicationsController } from '@/modules/credit-applications/infrastructure/http/credit-applications.controller';
import { CreditApplicationsService } from '@/modules/credit-applications/application/services/credit-applications.service';

describe('CreditApplicationsController', () => {
  let controller: CreditApplicationsController;
  let service: jest.Mocked<CreditApplicationsService>;

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      list: jest.fn(),
      getById: jest.fn(),
      update: jest.fn(),
      simulateOffer: jest.fn(),
      finalize: jest.fn(),
      abandon: jest.fn(),
      getEvents: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreditApplicationsController],
      providers: [{ provide: CreditApplicationsService, useValue: service }],
    }).compile();

    controller = module.get(CreditApplicationsController);
  });

  it('debería crear', async () => {
    const dto = { channel: 'self-service' } as any;
    const created = { id: '1' } as any;
    service.create.mockResolvedValue(created);
    const result = await controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toBe(created);
  });

  it('debería listar con filtros y cursor', async () => {
    const list = { data: [{ id: '1' } as any], nextCursor: '1', hasNextPage: false, limit: 10 };
    service.list.mockResolvedValue(list);
    const result = await controller.list('DRAFT', 'self-service', 'Juan', 'app-1', '10');
    expect(service.list).toHaveBeenCalledWith({ status: 'DRAFT', channel: 'self-service', q: 'Juan', cursor: 'app-1', limit: 10 });
    expect(result.data.length).toBe(1);
  });

  it('debería obtener por id', async () => {
    const app = { id: '1' } as any;
    service.getById.mockResolvedValue(app);
    const result = await controller.getById('1');
    expect(service.getById).toHaveBeenCalledWith('1');
    expect(result).toBe(app);
  });

  it('debería actualizar', async () => {
    const dto = { amount: 1000 } as any;
    const updated = { id: '1' } as any;
    service.update.mockResolvedValue(updated);
    const result = await controller.update('1', dto);
    expect(service.update).toHaveBeenCalledWith('1', dto);
    expect(result).toBe(updated);
  });

  it('debería simular oferta', async () => {
    const res = { status: 'approved' } as any;
    service.simulateOffer.mockResolvedValue(res);
    const result = await controller.simulateOffer('1');
    expect(service.simulateOffer).toHaveBeenCalledWith('1');
    expect(result).toBe(res);
  });

  it('debería finalizar', async () => {
    const res = { id: '1', status: 'PENDING_VALIDATION' } as any;
    service.finalize.mockResolvedValue(res);
    const result = await controller.finalize('1');
    expect(service.finalize).toHaveBeenCalledWith('1');
    expect(result).toBe(res);
  });

  it('debería abandonar', async () => {
    const dto = { reason: 'x' } as any;
    const res = { id: '1', status: 'ABANDONED' } as any;
    service.abandon.mockResolvedValue(res);
    const result = await controller.abandon('1', dto);
    expect(service.abandon).toHaveBeenCalledWith('1', dto);
    expect(result).toBe(res);
  });

  it('debería retornar eventos', async () => {
    const res = [{ id: 'e1' }] as any;
    service.getEvents.mockResolvedValue(res);
    const result = await controller.getEvents('1');
    expect(service.getEvents).toHaveBeenCalledWith('1');
    expect(result).toBe(res);
  });
});

import { CreateApplicationUseCase } from '@/modules/credit-applications/application/use-cases/create-application/create-application.use-case';
import { CreditApplication } from '@/modules/credit-applications/domain/entities/credit-application';
import { ICreditApplicationRepository } from '@/modules/credit-applications/domain/repositories/credit-application.repository';
import { CreateApplicationCommand } from '@/modules/credit-applications/application/use-cases/create-application/create-application.command';

class InMemoryCreditApplicationRepository implements ICreditApplicationRepository {
  private applications: CreditApplication[] = [];

  async save(application: CreditApplication): Promise<void> {
    this.applications.push(application);
  }

  async findById(id: string): Promise<CreditApplication | null> {
    return this.applications.find((a) => a.id === id) ?? null;
  }

  async findAll(): Promise<CreditApplication[]> {
    return this.applications;
  }

  async update(application: CreditApplication): Promise<void> {
    const index = this.applications.findIndex((a) => a.id === application.id);
    if (index >= 0) {
      this.applications[index] = application;
    }
  }
}

describe('CreateApplicationUseCase', () => {
  it('should create a draft application and record a CREATED event', async () => {
    const repository = new InMemoryCreditApplicationRepository();
    const useCase = new CreateApplicationUseCase(repository);

    const result = await useCase.execute({
      channel: 'self-service',
      documentType: 'CC',
      documentNumber: '1234567890',
      firstName: 'Juan',
      lastName: 'Pérez',
      phone: '3001234567',
      email: 'juan@example.com',
      city: 'Bogotá',
    });

    expect(result).toBeDefined();
    expect(result.status).toBe('DRAFT');
    expect(result.events).toHaveLength(1);
    expect(result.events[0].type).toBe('CREATED');

    const saved = await repository.findById(result.id);
    expect(saved).not.toBeNull();
    expect(saved!.documentNumber).toBe('1234567890');
  });
});

import { Injectable, Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreditApplication } from '@/modules/credit-applications/domain/entities/credit-application';
import type { ICreditApplicationRepository } from '@/modules/credit-applications/domain/repositories/credit-application.repository';
import type { CreateApplicationCommand } from '@/modules/credit-applications/application/use-cases/create-application/create-application.command';

@Injectable()
export class CreateApplicationUseCase {
  constructor(
    @Inject('CreditApplicationRepository')
    private readonly repository: ICreditApplicationRepository,
  ) {}

  async execute(command: CreateApplicationCommand): Promise<CreditApplication> {
    const now = new Date();
    const application = new CreditApplication({
      id: randomUUID(),
      channel: command.channel,
      advisorId: command.advisorId,
      documentType: command.documentType,
      documentNumber: command.documentNumber,
      firstName: command.firstName,
      lastName: command.lastName,
      phone: command.phone,
      email: command.email,
      city: command.city,
      income: 0,
      expenses: 0,
      amount: 0,
      term: 0,
      purpose: '',
      dataAuthorized: false,
      status: 'DRAFT',
      createdAt: now,
      updatedAt: now,
    });

    application.recordEvent('CREATED');

    await this.repository.save(application);

    return application;
  }
}

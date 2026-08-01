import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreditApplicationsService } from '@/modules/credit-applications/application/services/credit-applications.service';
import {
  ApplicationChannel,
  ApplicationStatus,
  DocumentType,
} from '@/modules/credit-applications/domain/credit-application.enums';
import type { CreateApplicationCommand } from '@/modules/credit-applications/application/use-cases/create-application/create-application.command';

const DEFAULT_APPLICATIONS: CreateApplicationCommand[] = [
  {
    channel: 'self-service',
    documentType: 'CC',
    documentNumber: '1000000001',
    firstName: 'Ana',
    lastName: 'López',
    phone: '3000000001',
    email: 'ana.lopez@example.com',
    city: 'Bogotá',
  },
  {
    channel: 'advisor',
    advisorId: 'ADV-001',
    documentType: 'CC',
    documentNumber: '1000000002',
    firstName: 'Carlos',
    lastName: 'Gómez',
    phone: '3000000002',
    email: 'carlos.gomez@example.com',
    city: 'Medellín',
  },
  {
    channel: 'self-service',
    documentType: 'CE',
    documentNumber: '1000000003',
    firstName: 'Laura',
    lastName: 'Martínez',
    phone: '3000000003',
    email: 'laura.martinez@example.com',
    city: 'Cali',
  },
  {
    channel: 'advisor',
    advisorId: 'ADV-002',
    documentType: 'CC',
    documentNumber: '1000000004',
    firstName: 'Pedro',
    lastName: 'Ríos',
    phone: '3000000004',
    email: 'pedro.rios@example.com',
    city: 'Barranquilla',
  },
  {
    channel: 'self-service',
    documentType: 'CC',
    documentNumber: '1000000005',
    firstName: 'María',
    lastName: 'Fernández',
    phone: '3000000005',
    email: 'maria.fernandez@example.com',
    city: 'Cartagena',
  },
];

@Injectable()
export class SeedService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly creditApplicationsService: CreditApplicationsService,
  ) {}

  private async seedReferences(): Promise<void> {
    const map = (
      domain: string,
      values: Record<string, string>,
    ) =>
      Object.entries(values).map(([code, label]) => ({
        domain,
        code,
        label,
        description: `Valor ${code} del dominio ${domain}`,
      }));

    const refs = [
      ...map('application-status', ApplicationStatus),
      ...map('application-channel', ApplicationChannel),
      ...map('document-type', DocumentType),
    ];

    for (const ref of refs) {
      await this.prisma.domainReference.upsert({
        where: { domain_code: { domain: ref.domain, code: ref.code } },
        create: { ...ref, isActive: true },
        update: {},
      });
    }
  }

  async populate(): Promise<{ created: number }> {
    const count = await this.prisma.creditApplication.count();
    if (count > 0) {
      throw new ConflictException('La base de datos ya contiene solicitudes. No se puede ejecutar el seed.');
    }

    await this.seedReferences();

    const created: string[] = [];
    for (const command of DEFAULT_APPLICATIONS) {
      const application = await this.creditApplicationsService.create(command);
      created.push(application.id);
    }

    // Primera: finalizada (viable)
    await this.creditApplicationsService.update(created[0], {
      income: 5_000_000,
      expenses: 1_500_000,
      amount: 10_000_000,
      term: 24,
      purpose: 'Viaje de vacaciones',
      dataAuthorized: true,
    });
    await this.creditApplicationsService.simulateOffer(created[0]);
    await this.creditApplicationsService.finalize(created[0]);

    // Segunda: no viable (monto muy alto)
    await this.creditApplicationsService.update(created[1], {
      income: 2_000_000,
      expenses: 800_000,
      amount: 20_000_000,
      term: 36,
      purpose: 'Renovación del hogar',
      dataAuthorized: true,
    });
    await this.creditApplicationsService.simulateOffer(created[1]);

    // Tercera: abandonada
    await this.creditApplicationsService.abandon(created[2], { reason: 'Ya no requiere el crédito' });

    return { created: DEFAULT_APPLICATIONS.length };
  }
}

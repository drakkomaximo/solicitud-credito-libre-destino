import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreditApplicationsService } from '@/modules/credit-applications/application/services/credit-applications.service';
import {
  ApplicationChannel,
  ApplicationStatus,
  CreditTerm,
  DocumentType,
} from '@/modules/credit-applications/domain/credit-application.enums';
import type { CreateApplicationCommand } from '@/modules/credit-applications/application/use-cases/create-application/create-application.command';

const ADVISORS = [
  { code: 'JGarciaM-4821', label: 'Juan García Mendoza' },
  { code: 'MLopezP-7392', label: 'María López Pérez' },
  { code: 'CRiosS-1234', label: 'Carlos Ríos Salazar' },
  { code: 'AMartinezV-5678', label: 'Ana Martínez Vega' },
  { code: 'LTorresH-9012', label: 'Luis Torres Herrera' },
];

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
    advisorId: 'JGarciaM-4821',
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
    advisorId: 'MLopezP-7392',
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
  {
    channel: 'advisor',
    advisorId: 'CRiosS-1234',
    documentType: 'PA',
    documentNumber: '1000000006',
    firstName: 'Luis',
    lastName: 'Torres',
    phone: '3000000006',
    email: 'luis.torres@example.com',
    city: 'Bucaramanga',
  },
  {
    channel: 'self-service',
    documentType: 'CC',
    documentNumber: '1000000007',
    firstName: 'Carmen',
    lastName: 'Rojas',
    phone: '3000000007',
    email: 'carmen.rojas@example.com',
    city: 'Pereira',
  },
  {
    channel: 'advisor',
    advisorId: 'AMartinezV-5678',
    documentType: 'CE',
    documentNumber: '1000000008',
    firstName: 'Jorge',
    lastName: 'Mendoza',
    phone: '3000000008',
    email: 'jorge.mendoza@example.com',
    city: 'Manizales',
  },
  {
    channel: 'self-service',
    documentType: 'CC',
    documentNumber: '1000000009',
    firstName: 'Sofia',
    lastName: 'Vargas',
    phone: '3000000009',
    email: 'sofia.vargas@example.com',
    city: 'Santa Marta',
  },
  {
    channel: 'advisor',
    advisorId: 'LTorresH-9012',
    documentType: 'CC',
    documentNumber: '1000000010',
    firstName: 'Andrés',
    lastName: 'Castro',
    phone: '3000000010',
    email: 'andres.castro@example.com',
    city: 'Cúcuta',
  },
  {
    channel: 'self-service',
    documentType: 'PA',
    documentNumber: '1000000011',
    firstName: 'Diana',
    lastName: 'Reyes',
    phone: '3000000011',
    email: 'diana.reyes@example.com',
    city: 'Villavicencio',
  },
  {
    channel: 'advisor',
    advisorId: 'JGarciaM-4821',
    documentType: 'CC',
    documentNumber: '1000000012',
    firstName: 'Ricardo',
    lastName: 'Morales',
    phone: '3000000012',
    email: 'ricardo.morales@example.com',
    city: 'Ibagué',
  },
  {
    channel: 'self-service',
    documentType: 'CE',
    documentNumber: '1000000013',
    firstName: 'Paola',
    lastName: 'Ortiz',
    phone: '3000000013',
    email: 'paola.ortiz@example.com',
    city: 'Neiva',
  },
  {
    channel: 'advisor',
    advisorId: 'MLopezP-7392',
    documentType: 'CC',
    documentNumber: '1000000014',
    firstName: 'Felipe',
    lastName: 'Salazar',
    phone: '3000000014',
    email: 'felipe.salazar@example.com',
    city: 'Pasto',
  },
  {
    channel: 'self-service',
    documentType: 'CC',
    documentNumber: '1000000015',
    firstName: 'Natalia',
    lastName: 'Guerrero',
    phone: '3000000015',
    email: 'natalia.guerrero@example.com',
    city: 'Armenia',
  },
  {
    channel: 'advisor',
    advisorId: 'CRiosS-1234',
    documentType: 'PA',
    documentNumber: '1000000016',
    firstName: 'Diego',
    lastName: 'Herrera',
    phone: '3000000016',
    email: 'diego.herrera@example.com',
    city: 'Tunja',
  },
  {
    channel: 'self-service',
    documentType: 'CC',
    documentNumber: '1000000017',
    firstName: 'Valentina',
    lastName: 'Cárdenas',
    phone: '3000000017',
    email: 'valentina.cardenas@example.com',
    city: 'Montería',
  },
  {
    channel: 'advisor',
    advisorId: 'AMartinezV-5678',
    documentType: 'CE',
    documentNumber: '1000000018',
    firstName: 'Sebastián',
    lastName: 'Paredes',
    phone: '3000000018',
    email: 'sebastian.paredes@example.com',
    city: 'Sincelejo',
  },
  {
    channel: 'self-service',
    documentType: 'CC',
    documentNumber: '1000000019',
    firstName: 'Isabella',
    lastName: 'Jiménez',
    phone: '3000000019',
    email: 'isabella.jimenez@example.com',
    city: 'Riohacha',
  },
  {
    channel: 'advisor',
    advisorId: 'LTorresH-9012',
    documentType: 'CC',
    documentNumber: '1000000020',
    firstName: 'Mateo',
    lastName: 'Moreno',
    phone: '3000000020',
    email: 'mateo.moreno@example.com',
    city: 'Florencia',
  },
  {
    channel: 'self-service',
    documentType: 'PA',
    documentNumber: '1000000021',
    firstName: 'Camila',
    lastName: 'Romero',
    phone: '3000000021',
    email: 'camila.romero@example.com',
    city: 'Popayán',
  },
  {
    channel: 'advisor',
    advisorId: 'JGarciaM-4821',
    documentType: 'CC',
    documentNumber: '1000000022',
    firstName: 'Tomás',
    lastName: 'Aguirre',
    phone: '3000000022',
    email: 'tomas.aguirre@example.com',
    city: 'Quibdó',
  },
];

@Injectable()
export class SeedService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly creditApplicationsService: CreditApplicationsService,
  ) {}

  private async seedReferences(): Promise<void> {
    const map = (domain: string, values: Record<string, string>) =>
      Object.entries(values).map(([code, label]) => ({
        domain,
        code,
        label,
        description: `Valor ${code} del dominio ${domain}`,
      }));

    const advisors = ADVISORS.map(({ code, label }) => ({
      domain: 'advisor',
      code,
      label,
      description: `Asesor ${label}`,
    }));

    const refs = [
      ...map('application-status', ApplicationStatus),
      ...map('application-channel', ApplicationChannel),
      ...map('document-type', DocumentType),
      ...map('credit-term', CreditTerm),
      ...advisors,
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
    await this.seedReferences();

    const count = await this.prisma.creditApplication.count();
    if (count > 0) {
      return { created: 0 };
    }

    const created: string[] = [];
    for (const command of DEFAULT_APPLICATIONS) {
      const application = await this.creditApplicationsService.create(command);
      created.push(application.id);
    }

    const TERMS = [12, 24, 36, 48, 60, 72];
    const PURPOSES = [
      'Viaje de vacaciones',
      'Renovación del hogar',
      'Estudios de posgrado',
      'Compra de vehículo',
      'Gastos de salud',
      'Inversión de capital',
      'Libre inversión',
    ];

    for (let i = 0; i < created.length; i++) {
      const id = created[i];
      const term = TERMS[i % TERMS.length];
      const income = 2_000_000 + (i % 7) * 800_000;
      const expenses = 500_000 + (i % 6) * 300_000;
      const amount = (i % 5 === 0 ? income * 4 : income * 2.2) + i * 100_000;
      const purpose = PURPOSES[i % PURPOSES.length];
      const dataAuthorized = i % 2 === 0;

      await this.creditApplicationsService.update(id, {
        income,
        expenses,
        amount,
        term,
        purpose,
        dataAuthorized,
      });

      const viable = amount <= income * 3;

      if (!viable) {
        await this.creditApplicationsService.simulateOffer(id);
        continue;
      }

      if (i % 7 === 1) {
        await this.creditApplicationsService.abandon(id, {
          reason: 'Ya no requiere el crédito',
        });
      } else if (dataAuthorized && i % 3 === 0) {
        await this.creditApplicationsService.simulateOffer(id);
        await this.creditApplicationsService.finalize(id);
      } else if (i % 4 === 2) {
        await this.creditApplicationsService.simulateOffer(id);
      }
    }

    return { created: DEFAULT_APPLICATIONS.length };
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import {
  CreditApplication,
  ApplicationEvent,
} from '@/modules/credit-applications/domain/entities/credit-application';
import type {
  ApplicationListFilters,
  ApplicationListQuery,
  ICreditApplicationRepository,
} from '@/modules/credit-applications/domain/repositories/credit-application.repository';

@Injectable()
export class PrismaCreditApplicationRepository implements ICreditApplicationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(application: CreditApplication): Promise<void> {
    await this.prisma.creditApplication.create({
      data: {
        id: application.id,
        channel: application.channel,
        advisorId: application.advisorId,
        documentType: application.documentType,
        documentNumber: application.documentNumber,
        firstName: application.firstName,
        lastName: application.lastName,
        phone: application.phone,
        email: application.email,
        city: application.city,
        income: application.income,
        expenses: application.expenses,
        amount: application.amount,
        term: application.term,
        purpose: application.purpose,
        dataAuthorized: application.dataAuthorized,
        status: application.status,
        createdAt: application.createdAt,
        updatedAt: application.updatedAt,
        events: {
          create: application.events.map((e) => ({
            id: e.id,
            type: e.type,
            payload: e.payload ?? null,
            occurredAt: e.occurredAt,
          })),
        },
      },
    });
  }

  async findById(id: string): Promise<CreditApplication | null> {
    const raw = await this.prisma.creditApplication.findUnique({
      where: { id },
      include: { events: true },
    });

    return raw ? this.toDomain(raw) : null;
  }

  async findByDocumentNumber(
    documentNumber: string,
  ): Promise<CreditApplication[]> {
    const raw = await this.prisma.creditApplication.findMany({
      where: { documentNumber },
      orderBy: { createdAt: 'desc' },
      include: { events: true },
    });

    return raw.map((r) => this.toDomain(r));
  }

  private buildWhere(filters: ApplicationListFilters = {}): any {
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.channel) where.channel = filters.channel;
    if (filters.documentNumber) where.documentNumber = filters.documentNumber;
    if (filters.phone) where.phone = filters.phone;
    if (filters.q) {
      where.OR = [
        { documentNumber: { contains: filters.q, mode: 'insensitive' } },
        { firstName: { contains: filters.q, mode: 'insensitive' } },
        { lastName: { contains: filters.q, mode: 'insensitive' } },
      ];
    }
    return where;
  }

  async findAll(
    query: ApplicationListQuery = {},
  ): Promise<CreditApplication[]> {
    const limit = Math.min(query.limit ?? 10, 100);
    const where = this.buildWhere(query);

    if (query.cursor) {
      where.id = { gt: query.cursor };
    }

    const raw = await this.prisma.creditApplication.findMany({
      where,
      take: limit + 1,
      orderBy: { id: 'asc' },
      include: { events: true },
    });

    return raw.map((r) => this.toDomain(r));
  }

  async count(filters: ApplicationListFilters = {}): Promise<number> {
    const where = this.buildWhere(filters);
    return this.prisma.creditApplication.count({ where });
  }

  async update(application: CreditApplication): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.applicationEvent.deleteMany({
        where: { applicationId: application.id },
      }),
      this.prisma.creditApplication.update({
        where: { id: application.id },
        data: {
          channel: application.channel,
          advisorId: application.advisorId,
          documentType: application.documentType,
          documentNumber: application.documentNumber,
          firstName: application.firstName,
          lastName: application.lastName,
          phone: application.phone,
          email: application.email,
          city: application.city,
          income: application.income,
          expenses: application.expenses,
          amount: application.amount,
          term: application.term,
          purpose: application.purpose,
          dataAuthorized: application.dataAuthorized,
          status: application.status,
          updatedAt: new Date(),
        },
      }),
      this.prisma.applicationEvent.createMany({
        data: application.events.map((e) => ({
          applicationId: application.id,
          id: e.id,
          type: e.type,
          payload: e.payload ?? null,
          occurredAt: e.occurredAt,
        })),
      }),
    ]);
  }

  private toDomain(raw: any): CreditApplication {
    return new CreditApplication({
      ...raw,
      events: raw.events.map(
        (e: any) => new ApplicationEvent({ type: e.type, payload: e.payload }),
      ),
    });
  }
}

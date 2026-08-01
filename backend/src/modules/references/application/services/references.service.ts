import { Injectable, NotFoundException } from '@nestjs/common';
import type { DomainReference } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';

export interface CreateReferenceDto {
  domain: string;
  code: string;
  label: string;
  description?: string;
}

export interface UpdateReferenceDto {
  label?: string;
  description?: string;
  isActive?: boolean;
}

export interface EnumsResult {
  status: string[];
  channel: string[];
  documentType: string[];
}

@Injectable()
export class ReferencesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<DomainReference[]> {
    return this.prisma.domainReference.findMany({
      orderBy: [{ domain: 'asc' }, { code: 'asc' }],
    });
  }

  async getByDomain(domain: string, activeOnly = true): Promise<DomainReference[]> {
    return this.prisma.domainReference.findMany({
      where: { domain, ...(activeOnly && { isActive: true }) },
      orderBy: { code: 'asc' },
    });
  }

  async getEnums(): Promise<EnumsResult> {
    const [status, channel, documentType] = await Promise.all([
      this.getByDomain('application-status'),
      this.getByDomain('application-channel'),
      this.getByDomain('document-type'),
    ]);

    return {
      status: status.map((r) => r.code),
      channel: channel.map((r) => r.code),
      documentType: documentType.map((r) => r.code),
    };
  }

  async create(dto: CreateReferenceDto): Promise<DomainReference> {
    return this.prisma.domainReference.create({ data: dto });
  }

  async update(id: string, dto: UpdateReferenceDto): Promise<DomainReference> {
    const exists = await this.prisma.domainReference.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Referencia no encontrada');
    return this.prisma.domainReference.update({ where: { id }, data: dto });
  }

  async toggle(id: string): Promise<DomainReference> {
    const ref = await this.prisma.domainReference.findUnique({ where: { id } });
    if (!ref) throw new NotFoundException('Referencia no encontrada');
    return this.prisma.domainReference.update({
      where: { id },
      data: { isActive: !ref.isActive },
    });
  }
}

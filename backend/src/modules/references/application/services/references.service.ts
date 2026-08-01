import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, type DomainReference } from '@prisma/client';
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

export type EnumsResult = Record<string, string[]>;

export interface ListReferencesQuery {
  domain?: string;
  cursor?: string;
  limit?: number;
  activeOnly?: boolean;
}

export interface ListReferencesResult {
  data: DomainReference[];
  nextCursor: string | null;
  hasNextPage: boolean;
  limit: number;
}

@Injectable()
export class ReferencesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: ListReferencesQuery = {}): Promise<ListReferencesResult> {
    const limit = Math.min(query.limit ?? 10, 100);
    const where: Prisma.DomainReferenceWhereInput = {};
    if (query.domain) where.domain = query.domain;
    if (query.activeOnly) where.isActive = true;

    const take = limit + 1;
    const skip = query.cursor ? 1 : 0;
    const refs = await this.prisma.domainReference.findMany({
      where,
      take,
      skip,
      cursor: query.cursor ? { id: query.cursor } : undefined,
      orderBy: [{ domain: 'asc' }, { code: 'asc' }],
    });

    const hasNextPage = refs.length > limit;
    const data = hasNextPage ? refs.slice(0, limit) : refs;
    const nextCursor = data.length > 0 ? data[data.length - 1].id : null;

    return { data, nextCursor, hasNextPage, limit };
  }

  async findById(id: string): Promise<DomainReference> {
    const ref = await this.prisma.domainReference.findUnique({ where: { id } });
    if (!ref) throw new NotFoundException('Referencia no encontrada');
    return ref;
  }

  async getByDomain(domain: string, activeOnly = true): Promise<DomainReference[]> {
    return this.prisma.domainReference.findMany({
      where: { domain, ...(activeOnly && { isActive: true }) },
      orderBy: { code: 'asc' },
    });
  }

  async getEnums(): Promise<EnumsResult> {
    const refs = await this.prisma.domainReference.findMany({
      where: { isActive: true },
      orderBy: [{ domain: 'asc' }, { code: 'asc' }],
      select: { domain: true, code: true },
    });

    const result: EnumsResult = {};
    for (const { domain, code } of refs) {
      (result[domain] ||= []).push(code);
    }

    return result;
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

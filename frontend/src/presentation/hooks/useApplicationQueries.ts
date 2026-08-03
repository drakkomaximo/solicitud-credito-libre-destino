import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/presentation/lib/queryKeys';
import { useApplicationActions } from './useApplicationActions';
import { GetReferences } from '@/application/useCases/GetReferences';
import { ReferenceApiRepository } from '@/infrastructure/repositories/ReferenceApiRepository';

export function useReferences() {
  return useQuery({
    queryKey: queryKeys.references(),
    queryFn: () => new GetReferences(new ReferenceApiRepository()).execute(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useApplicationList(filters: {
  role: string;
  status: string;
  channel: string;
  q: string;
}) {
  const { list } = useApplicationActions();
  return useQuery({
    queryKey: queryKeys.applications.list(filters),
    queryFn: () =>
      list.execute({
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.channel !== 'all' && { channel: filters.channel }),
        ...(filters.q && { q: filters.q }),
        limit: 10,
      }),
  });
}

export function useApplicationDetail(id: string) {
  const { get, getEvents } = useApplicationActions();
  return useQuery({
    queryKey: queryKeys.applications.detail(id),
    queryFn: async () => {
      const [app, events] = await Promise.all([
        get.execute(id),
        getEvents.execute(id),
      ]);
      return { app, events };
    },
  });
}

export function useApplicationEdit(id: string) {
  const { get } = useApplicationActions();
  return useQuery({
    queryKey: queryKeys.applications.edit(id),
    queryFn: () => get.execute(id),
  });
}

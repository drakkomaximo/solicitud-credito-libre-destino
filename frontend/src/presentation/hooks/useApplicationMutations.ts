import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/presentation/lib/queryKeys';
import { useApplicationActions } from './useApplicationActions';
import type { CreateApplicationInput } from '@/domain/entities/Application';
import type { EditApplicationFormData } from '@/presentation/validation/editApplicationSchema';

export function useApplicationMutations() {
  const queryClient = useQueryClient();
  const { create, save, simulate, finalize, abandon } = useApplicationActions();

  const createMutation = useMutation({
    mutationFn: (input: CreateApplicationInput) => create.execute(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.all() });
    },
  });

  const saveMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: EditApplicationFormData }) =>
      save.execute(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.applications.all(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.applications.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.applications.edit(variables.id),
      });
    },
  });

  const simulateMutation = useMutation({
    mutationFn: (id: string) => simulate.execute(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.applications.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.applications.edit(id),
      });
    },
  });

  const finalizeMutation = useMutation({
    mutationFn: (id: string) => finalize.execute(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.applications.all(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.applications.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.applications.edit(id),
      });
    },
  });

  const abandonMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      abandon.execute(id, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.applications.all(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.applications.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.applications.edit(variables.id),
      });
    },
  });

  return {
    create: createMutation,
    save: saveMutation,
    simulate: simulateMutation,
    finalize: finalizeMutation,
    abandon: abandonMutation,
    isPending:
      createMutation.isPending ||
      saveMutation.isPending ||
      simulateMutation.isPending ||
      finalizeMutation.isPending ||
      abandonMutation.isPending,
  };
}

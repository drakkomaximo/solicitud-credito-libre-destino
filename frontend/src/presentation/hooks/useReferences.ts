import { useEffect, useState } from 'react';
import { ReferenceMap } from '@/domain/entities/Reference';
import { GetReferences } from '@/application/useCases/GetReferences';
import { ReferenceApiRepository } from '@/infrastructure/repositories/ReferenceApiRepository';
import { commonMessages } from '@/presentation/messages/common';

export function useReferences() {
  const [references, setReferences] = useState<ReferenceMap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const repository = new ReferenceApiRepository();
    const useCase = new GetReferences(repository);

    useCase
      .execute()
      .then((data) => {
        if (!cancelled) setReferences(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : commonMessages.catalogError);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { references, loading, error };
}

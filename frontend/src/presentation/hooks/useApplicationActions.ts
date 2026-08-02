import { useMemo } from 'react';
import { CreateApplication } from '@/application/useCases/CreateApplication';
import { GetApplication } from '@/application/useCases/GetApplication';
import { GetApplicationEvents } from '@/application/useCases/GetApplicationEvents';
import { ListApplications } from '@/application/useCases/ListApplications';
import { SaveDraft } from '@/application/useCases/SaveDraft';
import { SimulateOffer } from '@/application/useCases/SimulateOffer';
import { FinalizeApplication } from '@/application/useCases/FinalizeApplication';
import { AbandonApplication } from '@/application/useCases/AbandonApplication';
import { ApplicationApiRepository } from '@/infrastructure/repositories/ApplicationApiRepository';
import { CookieTokenStorage } from '@/infrastructure/storage/CookieTokenStorage';

export function useApplicationActions() {
  return useMemo(() => {
    const tokenStorage = new CookieTokenStorage();
    const repository = new ApplicationApiRepository(tokenStorage);
    return {
      create: new CreateApplication(repository),
      get: new GetApplication(repository),
      getEvents: new GetApplicationEvents(repository),
      list: new ListApplications(repository),
      save: new SaveDraft(repository),
      simulate: new SimulateOffer(repository),
      finalize: new FinalizeApplication(repository),
      abandon: new AbandonApplication(repository),
    };
  }, []);
}

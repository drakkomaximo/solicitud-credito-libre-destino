import { SetMetadata } from '@nestjs/common';

export const NO_ENVELOPE_KEY = 'no-envelope';

export const NoEnvelope = () => SetMetadata(NO_ENVELOPE_KEY, true);

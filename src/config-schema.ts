import { Type } from '@openmrs/esm-framework';

export const configSchema = {
  searchTitle: {
    _type: Type.Boolean,
    _default: false,
    _description: 'Short or long title',
  },
};

export type Config = {
  searchTitle: boolean;
};

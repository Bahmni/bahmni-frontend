import { DrugOrderConfig } from '../types';

export const mockDrugsApiResponse = {
  validResponse: {
    results: [
      {
        uuid: '1',
        name: 'Paracetomal 1',
        strength: '',
        concept: '',
        dosageForm: '',
      },
      {
        uuid: '2',
        name: 'Paracetomal 2',
        strength: '',
        concept: '',
        dosageForm: '',
      },
    ],
  },
  emptyResponse: {
    results: [],
  },
};

export const mockDrugOrderConfigApiResponse: DrugOrderConfig = {
  doseUnits: [
    { name: 'Tablet', rootConcept: null },
    { name: 'Drop', rootConcept: null },
  ],
  durationUnits: [{ name: 'Days', rootConcept: null }],
  frequencies: [{ name: 'Immediately', frequencyPerDay: 1, uuid: '1' }],
  routes: [{ name: 'Oral', rootConcept: null }],
};

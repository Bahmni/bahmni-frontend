import {DrugOrderConfig} from '../../types'

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
}

export const mockActivePrescriptionResponse = [
  {
    visit: {
      startDateTime: 1496851128000,
    },
    dateStopped: null,
    provider: {
      name: 'Super Man',
    },
    drug: {
      name: 'Aspirin 75mg',
      form: 'Tablet',
    },
    dosingInstructions: {
      dose: 5.0,
      doseUnits: 'Capsule(s)',
      route: 'Oral',
      frequency: 'Thrice a day',
      administrationInstructions:
        '{"instructions":"As directed","additionalInstructions":"Test Data"}',
      quantity: 150.0,
      quantityUnits: 'Capsule(s)',
    },
    duration: 5,
    durationUnits: 'Day(s)',
    effectiveStartDate: 1640164841000,
  },
]

export const mockPrescriptionResponse = [
  {
    visit: {
      startDateTime: 1496851128000,
    },
    dateStopped: '1607888143',
    provider: {
      name: 'Super Man',
    },
    drug: {
      name: 'Aspirin 75mg',
      form: 'Tablet',
    },
    dosingInstructions: {
      dose: 5.0,
      doseUnits: 'Capsule(s)',
      route: 'Oral',
      frequency: 'Thrice a day',
      administrationInstructions:
        '{"instructions":"As directed","additionalInstructions":"Test Data"}',
      quantity: 150.0,
      quantityUnits: 'Capsule(s)',
    },
    duration: 5,
    durationUnits: 'Day(s)',
    effectiveStartDate: 1640164841000,
  },
]

export const mockDrugOrderConfigApiResponse: DrugOrderConfig = {
  doseUnits: [
    {name: 'Tablet', rootConcept: null},
    {name: 'Drop', rootConcept: null},
  ],
  durationUnits: [{name: 'Day(s)', rootConcept: null}],
  frequencies: [
    {name: 'Immediately', frequencyPerDay: 1, uuid: '1'},
    {name: 'Twice a day', frequencyPerDay: 2, uuid: '2'},
  ],
  routes: [{name: 'Oral', rootConcept: null}],
}

export const mockDrugOrderConfigBadApiResponse: DrugOrderConfig = {
  doseUnits: undefined,
  durationUnits: [{name: 'Days', rootConcept: null}],
  frequencies: [{name: 'Immediately', frequencyPerDay: 1, uuid: '1'}],
  routes: [{name: 'Oral', rootConcept: null}],
}

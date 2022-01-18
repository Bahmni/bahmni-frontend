export const durgOrdersUrl = '/openmrs/ws/rest/v1/bahmnicore/drugOrders/active'

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
    dateActivated: 1640164841000,
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
  {
    visit: {
      startDateTime: 1496851128000,
    },
    dateStopped: 1607888143,
    dateActivated: 1640254629000, //Date: 23/12/2021
    provider: {
      name: 'Super Man',
    },
    drug: {
      name: 'Aspirin 1',
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
    dateStopped: 1607888143,
    dateActivated: 1640164841000,
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

export const mockAllPrescriptionResponse = [
  {
    visit: {
      startDateTime: 1496851128000,
    },
    dateStopped: 1607888143,
    dateActivated: 1640254629000, //Date: 23/12/2021
    provider: {
      name: 'Super Man',
    },
    drug: {
      name: 'Aspirin 1',
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
  {
    visit: {
      startDateTime: 1496851128000,
    },
    dateStopped: null,
    dateActivated: 1640164841000, //Date : 22/12/2021
    provider: {
      name: 'Super Man',
    },
    drug: {
      name: 'Aspirin 2',
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
  {
    visit: {
      startDateTime: 1496851128000,
    },
    dateStopped: null,
    dateActivated: 1640164841000, //Date : 22/12/2021
    provider: {
      name: 'Super Man',
    },
    drug: {
      name: 'Aspirin 3',
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

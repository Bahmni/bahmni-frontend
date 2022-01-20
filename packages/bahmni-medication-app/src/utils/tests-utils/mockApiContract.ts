import {DrugOrderConfig} from '../../types'

const currentDate = new Date()
const nextDay = currentDate.setDate(currentDate.getDate() + 1)
const previousDay = currentDate.setDate(currentDate.getDate() - 1)

export const mockDrugsApiResponse = {
  validResponse: {
    results: [
      {
        uuid: '1',
        name: 'Paracetomal 1',
        strength: '',
        concept: '',
        dosageForm: {uuid: '1', display: 'Tablet'},
      },
      {
        uuid: '2',
        name: 'Paracetomal 2',
        strength: '',
        concept: '',
        dosageForm: {uuid: '1', display: 'Tablet'},
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
    effectiveStopDate: nextDay,
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
    effectiveStopDate: nextDay,
  },
]

export const mockPrescriptionResponse = [
  {
    visit: {
      startDateTime: 1496851128000,
    },
    dateStopped: 1607888143,
    dateActivated: 1640164841000, //Date: 22/12/2021
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
    effectiveStopDate: 1607888143,
  },
  {
    visit: {
      startDateTime: 1496851128000,
    },
    dateStopped: null,
    dateActivated: 1640254629000, //Date: 23/12/2021
    provider: {
      name: 'Super Man',
    },
    drug: {
      name: 'Aspirin 2',
      form: 'Tablet',
    },
    dosingInstructions: {
      dose: 4.0,
      doseUnits: 'Capsule(s)',
      route: 'Oral',
      frequency: 'Thrice a day',
      administrationInstructions: '{"instructions":"As directed"}',
      quantity: 140.0,
      quantityUnits: 'Capsule(s)',
    },
    duration: 4,
    durationUnits: 'Day(s)',
    effectiveStartDate: 1640164841000,
    effectiveStopDate: nextDay,
  },
]

export const mockPrescriptionResponseForNonCodedDrug = [
  {
    visit: {
      startDateTime: 1496851128000,
    },
    dateActivated: 1640164841000,
    dateStopped: 1607888143,
    provider: {
      name: 'Super Man',
    },
    drug: null,
    drugNonCoded: 'Paz',
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
    effectiveStopDate: 1607888143,
  },
]
export const mockAllPrescriptionResponse = {
  active: [
    {
      visit: {
        startDateTime: 1496851128000,
      },
      dateStopped: null,
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
      effectiveStopDate: nextDay,
    },
  ],
  scheduled: [
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
      effectiveStartDate: nextDay,
      effectiveStopDate: nextDay + 1,
    },
  ],
  //Finished Prescription
  finished: [
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
      effectiveStopDate: previousDay,
    },
  ],
  //Stopped Prescription
  stopped: [
    {
      visit: {
        startDateTime: 1496851128000,
      },
      dateStopped: previousDay,
      dateActivated: 1640164841000, //Date : 22/12/2021
      provider: {
        name: 'Super Man',
      },
      drug: {
        name: 'Aspirin 4',
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
      effectiveStopDate: previousDay,
    },
  ],
}

export const mockMedicationConfigRespone = {
  commonConfig: {},
  tabConfig: {
    allMedicationTabConfig: {
      inputOptionsConfig: {
        allowOnlyCodedDrugs: false,
      },
    },
  },
}
export const mockNonCodedDrugConfigResponse = {
  commonConfig: {},
  tabConfig: {
    allMedicationTabConfig: {
      inputOptionsConfig: {
        allowOnlyCodedDrugs: true,
      },
    },
  },
}

export const mockDrugOrderConfigApiResponse: DrugOrderConfig = {
  doseUnits: [
    {name: 'Tablet(s)', rootConcept: null},
    {name: 'Drop', rootConcept: null},
  ],
  durationUnits: [{name: 'Day(s)', rootConcept: null}],
  frequencies: [
    {name: 'Immediately', frequencyPerDay: 1, uuid: '1'},
    {name: 'Twice a day', frequencyPerDay: 2, uuid: '2'},
    {name: 'Once a week', frequencyPerDay: 1 / 7, uuid: '3'},
    {name: 'Once a month', frequencyPerDay: 1 / 30, uuid: '4'},
  ],
  routes: [
    {name: 'Oral', rootConcept: null},
    {name: 'Topical', rootConcept: null},
  ],
}

export const mockDrugOrderConfigBadApiResponse: DrugOrderConfig = {
  doseUnits: undefined,
  durationUnits: [{name: 'Days', rootConcept: null}],
  frequencies: [{name: 'Immediately', frequencyPerDay: 1, uuid: '1'}],
  routes: [{name: 'Oral', rootConcept: null}],
}

export const mockMedicationConfig = {
  tabConfig: {
    allMedicationTabConfig: {
      inputOptionsConfig: {
        frequencyDefaultDurationUnitsMap: [
          {
            minFrequency: '1/7',
            maxFrequency: 5,
            defaultDurationUnit: 'Day(s)',
          },
          {
            minFrequency: '1/30',
            maxFrequency: '1/7',
            defaultDurationUnit: 'Week(s)',
          },
          {
            minFrequency: null,
            maxFrequency: '1/30',
            defaultDurationUnit: 'Month(s)',
          },
        ],

        drugFormDefaults: {
          Tablet: {
            doseUnits: 'Tablet(s)',
            route: 'Oral',
          },
        },
      },
    },
  },
}

export const mockNonCodedDrug = {
  name: 'Non-Coded Drug',
}

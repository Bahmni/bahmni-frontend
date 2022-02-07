export const headerData = [
  'Drug Information - Name, Form, Route',
  'Schedule - Dosage, Frequency, Duration',
  'Total quantity',
  'Instruction',
  'Status',
  'Action',
]

export const newPrescriptionHeader = [
  'Drug Information - Name, Form, Route',
  'Schedule - Dosage, Frequency, Duration',
  'Total quantity',
  'Instruction',
  'Action',
]
export const BASE_URL = ''
export const REST_ENDPOINTS = {
  DRUG_ORDER_CONFIG: '/openmrs/ws/rest/v1/bahmnicore/config/drugOrders',
  ACTIVE_PRESCRIPTION: '/openmrs/ws/rest/v1/bahmnicore/drugOrders/active',
  ALL_PRESCRIPTION: '/openmrs/ws/rest/v1/bahmnicore/drugOrders',
  DRUG_SEARCH: '/openmrs/ws/rest/v1/drug',
  PROVIDER: '/openmrs/ws/rest/v1/provider',
  ENCOUNTER_TYPE: '/openmrs/ws/rest/v1/encountertype/Consultation',
  VISIT: '/openmrs/ws/rest/v1/visit',
  SAVE_NEW_PRESCRIPTION: '/openmrs/ws/rest/v1/bahmnicore/bahmniencounter',
  CONCEPT: '/openmrs/ws/rest/v1/concept',
}
export const CONFIG_URLS = {
  MEDICATION_CONFIG: '/bahmni_config/openmrs/apps/clinical/medication.json',
}
export const defaultDurationUnits = [
  {name: 'Day(s)', factor: 1},
  {name: 'Week(s)', factor: 7},
  {name: 'Month(s)', factor: 30},
]

export const stopReasons: string[] = ['Allergic Rection']

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
  DRUG_SEARCH: '/openmrs/ws/rest/v1/drug',
}
export const CONFIG_URLS = {
  MEDICATION_CONFIG: '/bahmni_config/openmrs/apps/clinical/medication.json',
}
export const defaultDurationUnits = [
  {name: 'Day(s)', factor: 1},
  {name: 'Week(s)', factor: 7},
  {name: 'Month(s)', factor: 30},
]

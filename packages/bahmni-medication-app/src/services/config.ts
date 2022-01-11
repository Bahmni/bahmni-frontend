import {api, responseBody} from './axios'

export const fetchMedicationConfig = async (): Promise<any> => {
  const response = await api.get<any>(
    `/bahmni_config/openmrs/apps/clinical/medication.json`,
  )
  return responseBody(response)
}

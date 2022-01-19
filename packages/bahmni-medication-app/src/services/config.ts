import {CONFIG_URLS} from '../utils/constants'
import {api, responseBody} from './axios'

export const fetchMedicationConfig = async (): Promise<any> => {
  const response = await api.get<any>(CONFIG_URLS.MEDICATION_CONFIG)
  return responseBody(response)
}

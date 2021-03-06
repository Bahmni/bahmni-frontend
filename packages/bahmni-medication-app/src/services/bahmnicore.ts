import type {DrugOrderConfig, EncounterPayload} from '../types/index'
import {REST_ENDPOINTS} from '../utils/constants'
import {api, responseBody} from './axios'

type ActivePrescription = {
  patientUuid: String
}

export const getActivePrescription = async ({patientUuid}): Promise<any> => {
  const response = await api.get<ActivePrescription>(
    REST_ENDPOINTS.ACTIVE_PRESCRIPTION,
    {
      params: {
        patientUuid,
      },
    },
  )
  return responseBody(response)
}

export const getAllPrescription = async ({patientUuid}): Promise<any> => {
  const response = await api.get<ActivePrescription>(
    REST_ENDPOINTS.ALL_PRESCRIPTION,
    {
      params: {
        patientUuid,
        includeActiveVisit: true,
      },
    },
  )
  return responseBody(response)
}
export const fetchDrugOrderConfig = async (): Promise<DrugOrderConfig> => {
  const response = await api.get<DrugOrderConfig>(
    REST_ENDPOINTS.DRUG_ORDER_CONFIG,
  )
  return responseBody(response)
}

export const saveMedicationEncounter = async (payload: EncounterPayload) => {
  const response = await api.post<EncounterPayload>(
    REST_ENDPOINTS.SAVE_NEW_PRESCRIPTION,
    payload,
  )
  return responseBody(response)
}

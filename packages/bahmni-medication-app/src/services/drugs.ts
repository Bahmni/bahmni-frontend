import {REST_ENDPOINTS} from '../utils/constants'
import {api, responseBody} from './axios'

export const search = async (drugName): Promise<any> => {
  const s = 'ordered'
  const v =
    'custom:(uuid,strength,name,dosageForm,concept:(uuid,name,names:(name)))'
  const response = await api.get<any>(REST_ENDPOINTS.DRUG_SEARCH, {
    params: {q: drugName, s, v},
  })
  return responseBody(response)
}

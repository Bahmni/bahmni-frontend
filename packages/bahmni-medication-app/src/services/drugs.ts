import { api, responseBody } from './axios';

export const search = async (drugName): Promise<any> => {
  const s = 'ordered';
  const v = 'custom:(uuid,strength,name,dosageForm,concept:(uuid,name,names:(name)))';
  const response = await api.get<any>(`/openmrs/ws/rest/v1/drug`, {
    params: { q: drugName, s, v },
  });
  return responseBody(response);
};

import axios from 'axios';

const BASE_URL = 'https://demo.mybahmni.org';
export const search = async (drugName): Promise<any> => {
  const s = 'ordered';
  const v = 'custom:(uuid,strength,name,dosageForm,concept:(uuid,name,names:(name)))';
  const res = await axios.get<any>(`${BASE_URL}/openmrs/ws/rest/v1/drug`, {
    params: { q: drugName, s, v },
  });
  return res.data;
};

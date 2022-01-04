import axios from 'axios';
import { DrugOrderConfig } from './types';

const BASE_URL = '';
export const search = async (drugName): Promise<any> => {
  const s = 'ordered';
  const v = 'custom:(uuid,strength,name,dosageForm,concept:(uuid,name,names:(name)))';
  const res = await axios.get<any>(`${BASE_URL}/openmrs/ws/rest/v1/drug`, {
    params: { q: drugName, s, v },
  });
  return res.data;
};

export const fetchDrugOrderConfig = async (): Promise<DrugOrderConfig> => {
  const res = await axios.get<DrugOrderConfig>(`${BASE_URL}/openmrs/ws/rest/v1/bahmnicore/config/drugOrders`);
  return res.data;
};

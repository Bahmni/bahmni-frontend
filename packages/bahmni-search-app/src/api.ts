import axios from 'axios';

export const search = async (drugName) => {
  const s = 'ordered';
  const v = 'custom:(uuid,strength,name,dosageForm,concept:(uuid,name,names:(name)))';
  const res = await axios.get('https://demo.mybahmni.org/openmrs/ws/rest/v1/drug', {
    params: { q: drugName, s, v },
  });
  return res.data;
};

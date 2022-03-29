import { Type, validators } from '@openmrs/esm-framework';
import { spaRoot, patientLabChartPath} from './constants';
export const configSchema = {
  search: {
    patientResultUrl: {
      _default: spaRoot + patientLabChartPath, 
      _description: 'Where clicking a patient result takes the user. Accepts template parameter ${patientUuid}',
      _validators: [validators.isUrlWithTemplateParameters(['patientUuid'])],
    },
  }
};

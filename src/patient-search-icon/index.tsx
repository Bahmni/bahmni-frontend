import React from 'react';
import { PlayOutline24 } from '@carbon/icons-react';
import { navigate } from '@openmrs/esm-framework';
import { HeaderGlobalAction } from 'carbon-components-react';

interface BahmniPatientSearchLaunchProps {}
const BahmniPatientSearchLaunch: React.FC<BahmniPatientSearchLaunchProps> = () => {
  return (
    <HeaderGlobalAction
      onClick={() =>
        navigate({
          to: '${openmrsSpaBase}/search',
        })
      }
      aria-label="Bahmni Patient Search"
      aria-labelledby="Bahmni Patient Search"
      name="BahmniPatientSearch">
      <PlayOutline24 />
    </HeaderGlobalAction>
  );
};
export default BahmniPatientSearchLaunch;

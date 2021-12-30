import React, { useEffect } from 'react';
import { useAsync } from 'react-async';
import { getActivePrescription } from './api';
import { getPatientUuid } from './utils/helper';
import PrescriptionTable from './common/PrescriptionTable';
import { ActiveDrug } from './types/activePrescriptionTypes';

const ActivePrescription = () => {
  const patientUuid: String = getPatientUuid();

  const { run: runActivePrescription, data: activePrescriptionData } = useAsync<ActiveDrug[]>({
    deferFn: () => getActivePrescription(patientUuid),
  });

  useEffect(() => {
    if (patientUuid) {
      runActivePrescription();
    }
  }, []);

  return (
    <div data-testid="activePrescription">
      {activePrescriptionData && <PrescriptionTable data={activePrescriptionData}></PrescriptionTable>}
    </div>
  );
};

export default ActivePrescription;

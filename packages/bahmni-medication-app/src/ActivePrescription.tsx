import React, { useEffect } from 'react';
import { useAsync } from 'react-async';
import { getActivePrescription } from './api';
import { getPatientUuid } from './helper';
import PrescriptionTable from './PrescriptionTable';

const ActivePrescription = () => {
  const patientUuid = getPatientUuid();

  const { run: runActivePrescription, data: activePrescriptionData } = useAsync({
    deferFn: () => getActivePrescription(patientUuid),
    //onReject: (e) => activePrescriptionError ?? console.log(e),
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

import React from 'react'
import { RouteComponentProps } from 'react-router-dom';
import {useTranslation} from 'react-i18next'
import PatientInfo from '../PatientInfo/PatientInfo';
import { BrowserRouter, Route } from 'react-router-dom';
import { ExtensionSlot, usePatient } from '@openmrs/esm-framework';
import Loader from '../loader/loader.component';

const styles = {
  chartContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'column',
    paddingRight: 10
  },
  innerChartContainer: {
    display: 'flex',
    width: '100%',
    paddingRight: '45px',
    flexDirection: 'column'
  
  },
}

interface PatientLabChartParams {
  patientUuid: string;
}
//TODO useMemo
//TODO loader style
//breadcrumbs
const PatientLabChart: React.FC<RouteComponentProps<PatientLabChartParams>> = ({match}) => {
  const { patientUuid } = match.params
  const {isLoading, patient, error } = usePatient(patientUuid)
  // if(isLoading) return <Loader/>
  // if(error) return <div>Something went wrong: {error.message}</div>
  // console.dir(patient)
  // return (
  //   <aside>
  //   <ExtensionSlot
  //             extensionSlotName="patient-header-slot"
  //             state={{
  //               patient,
  //               patientUuid: patient.id
  //             }}
  //           />
  //   </aside>
  // );

  return (
    <main style={{ margin: "auto", width: "50%" }}>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <div>Something went wrong: {error.message}</div> 
      ) : (
        <>
          <div className={`omrs-main-content ${styles.innerChartContainer}`}>
            <ExtensionSlot extensionSlotName="breadcrumbs-slot" />
            <aside>
              <ExtensionSlot extensionSlotName="patient-header-slot" state={{patient, patientUuid: patient.id}} />
              {/* <ExtensionSlot extensionSlotName="patient-info-slot" state={state} /> */}
            </aside>
          </div>
        </>
      )}
    </main>
  );
}

export default PatientLabChart;
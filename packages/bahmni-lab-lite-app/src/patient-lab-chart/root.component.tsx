import React from 'react';
import { SWRConfig } from 'swr';
import { BrowserRouter, Route } from 'react-router-dom';
import { spaRoot, patientLabChartPath, patientLabChartRoute } from '../constants'
import PatientLabChart from './patient-lab-chart';

const swrConfiguration = {
  // Maximum number of retries when the backend returns an error
  errorRetryCount: 3,
};

const Root: React.FC = () => {
  return (
    <main>
      <SWRConfig value={swrConfiguration}>
        <BrowserRouter basename={spaRoot}>
          <Route path={patientLabChartRoute} component={PatientLabChart} />
        </BrowserRouter>
      </SWRConfig>
    </main>
  );
};

export default Root;

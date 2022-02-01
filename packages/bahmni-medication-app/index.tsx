import React from 'react'
import ReactDOM from 'react-dom'
import MedicationApp from './src'
import {StoppedPrescriptionsProvider} from './src/context/StoppedPrescriptionContext'

ReactDOM.render(
  <StoppedPrescriptionsProvider>
    <MedicationApp />
  </StoppedPrescriptionsProvider>,
  document.getElementById('medication-app'),
)

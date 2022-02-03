import {Tab, Tabs} from '@bahmni/design-system'
import React from 'react'
import ActivePrescription from './ActivePrescription'
import AllPrescription from './AllPrescription'

const styles = {
  tablePosition: {
    paddingTop: '5rem',
  },
}

export const PrescriptionWidget = () => {
  return (
    <div style={styles.tablePosition} title="prescriptionWidget">
      <Tabs>
        <Tab label="Active Prescription">
          <ActivePrescription />
        </Tab>
        <Tab label="Scheduled" />
        <Tab label="Show all">
          <AllPrescription />
        </Tab>
      </Tabs>
    </div>
  )
}

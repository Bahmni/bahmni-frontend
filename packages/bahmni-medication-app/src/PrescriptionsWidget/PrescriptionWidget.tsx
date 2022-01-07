import {Tab, Tabs} from '@bahmni/design-system'
import React from 'react'
import ActivePrescription from './ActivePrescription'

const styles = {
  tablePosition: {
    paddingTop: '10rem',
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
        <Tab label="Show all" />
      </Tabs>
    </div>
  )
}

import React from 'react'
import {PrescriptionItem} from '../types/medication'

interface StoppedPrescriptionContextInterface {
  stoppedPrescriptions: PrescriptionItem[]
  setStoppedPrescriptions: Function
}
const StoppedPrescriptionContext =
  React.createContext<StoppedPrescriptionContextInterface>(null)

function useStoppedPrescriptions() {
  const context = React.useContext(StoppedPrescriptionContext)
  if (!context) {
    throw new Error(
      `useStoppedPrescriptions must be used within a StoppedPrescriptionsProviderr`,
    )
  }
  return context
}

function StoppedPrescriptionsProvider({children}) {
  const [stoppedPrescriptions, setStoppedPrescriptions] = React.useState<
    PrescriptionItem[]
  >([])

  const value = {stoppedPrescriptions, setStoppedPrescriptions}
  return (
    <StoppedPrescriptionContext.Provider value={value}>
      {children}
    </StoppedPrescriptionContext.Provider>
  )
}

export {StoppedPrescriptionsProvider, useStoppedPrescriptions}

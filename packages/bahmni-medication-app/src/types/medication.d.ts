export interface PrescriptionItem {
  visit: any
  dateStopped: number
  dateActivated: number
  provider: any
  concept?: any
  drug: any
  dosingInstructions: any
  duration: number
  durationUnits: string
  effectiveStartDate: number
  effectiveStopDate: number
}

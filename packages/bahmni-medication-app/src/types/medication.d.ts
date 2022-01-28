export interface ActiveDrug {
  visit: Visit
  dateStopped: String
  provider: any
  concept?: any
  drug: any
  drugNonCoded: String
  dosingInstructions: any
  duration: number
  durationUnits: String
  effectiveStartDate: Number
}

export type Visit = {
  startDateTime: Number
  uuid: String
}

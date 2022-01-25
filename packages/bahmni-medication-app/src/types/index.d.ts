export type DosageForm = {
  uuid: string
  display: string
}
export type Drug = {
  uuid?: string
  name: string
  strength?: string
  concept?: any
  dosageForm?: DosageForm
}

export type NonCodedDrug = {
  name: String
  dosageForm?: DosageForm = undefined
}

export type DrugResult = {
  results: Drug[]
}
export type Unit = {
  name: string
  rootConcept: any
}

export type Route = {
  name: string
  rootConcept: any
}

export type Frequency = {
  uuid: string
  frequencyPerDay: number
  name: string
}

export type DrugOrderConfig = {
  doseUnits: Unit[]
  durationUnits: Unit[]
  routes: Route[]
  frequencies: Frequency[]
}

export type DurationUnit = {
  name: string
  factor: number
}

export type StopPrescriptionInfo = {
  stopDate: Date
  reason?: string
  notes?: string
}

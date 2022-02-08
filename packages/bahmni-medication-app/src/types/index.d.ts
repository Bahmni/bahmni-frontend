import {PrescriptionItem} from './medication'

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
  uuid?: String
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

export type NewPrescription = {
  careSetting: string
  action?: string
  dateStopped: number
  autoExpireDate: number
  concept?: Concept
  dosingInstructions: DosingInstructions
  drug: DrugInfo
  drugNonCoded?: any
  duration: number
  durationUnits: String
  effectiveStartDate: number
  effectiveStopDate: number
  scheduledDate: number
}

export type Concept = {
  uuid: String
}

export type EncounterPayload = {
  locationUuid: String
  patientUuid: String
  encounterUuid: String
  visitUuid: String
  providers: [
    {
      uuid: String
    },
  ]
  encounterDateTime?: String
  visitType: String
  bahmniDiagnoses: Array
  orders: Array
  drugOrders: Array<NewPrescription | PrescriptionItem>
  disposition: String
  observations: Array
  encounterTypeUuid: String
}

export type DrugInfo = {
  form: String
  name: String
  strength: String
  uuid: String
}

export type DosingInstructions = {
  administrationInstructions?: String
  asNeeded?: boolean
  dose: number
  doseUnits: String
  frequency: String
  numberOfRefills?: any
  quantity: number
  quantityUnits: String
  route: String
}

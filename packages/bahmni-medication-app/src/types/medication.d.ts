export type PrescriptionItem = {
  action?: string
  autoExpireDate?: number
  careSetting?: string
  commentToFulfiller?: string
  concept?: Concept
  creatorName?: string
  dateActivated: number
  dateStopped: number | Date
  dosingInstructions: DosingInstructions
  dosingInstructionType?: string
  drug: DrugInfo
  drugNonCoded?: string
  duration: number
  durationUnits: string
  effectiveStartDate: number
  effectiveStopDate: number
  instructions?: any
  orderAttributes?: any
  orderGroup?: any
  orderNumber?: string
  orderReasonConcept?: {uuid: string; name: string}
  orderReasonText?: string
  orderType?: string
  previousOrderUuid?: string
  provider?: any
  retired?: boolean
  scheduledDate?: number
  sortWeight?: any
  uuid?: string
  visit?: any
}

export interface Concept {
  conceptClass?: string
  dataType?: string
  hiNormal?: string
  lowNormal?: string
  mappings?: []
  name?: string
  set?: boolean
  shortName?: string
  uuid: string
}

export interface DosingInstructions {
  administrationInstructions?: string
  asNeeded?: boolean
  dose: number
  doseUnits: string
  frequency: string
  numberOfRefills?: any
  quantity: number
  quantityUnits: string
  route: string
}

export interface DrugInfo {
  form: String
  name: String
  strength?: String
  uuid?: String
}

export type Visit = {
  startDateTime: Number
  uuid: String
}

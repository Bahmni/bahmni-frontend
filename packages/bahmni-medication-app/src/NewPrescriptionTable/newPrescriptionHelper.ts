import {
  DosingInstructions,
  DrugInfo,
  DurationUnit,
  EncounterPayload,
  NewPrescription,
  Concept,
} from '../types'
import {getPatientUuid} from '../utils/helper'

const getDurationInDays = (
  duration: number,
  durationUnit: DurationUnit,
): number => {
  return duration ? duration * (durationUnit.factor || 1) : Number.NaN
}

const getExpiredDate = (effectiveStartDate: number, durationInDays: number) => {
  const d = new Date(effectiveStartDate)
  return d.setDate(d.getDate() + durationInDays)
}

export const createDrugOrder = (data): NewPrescription => {
  const dosingInstructions: DosingInstructions = {
    dose: data.dose,
    doseUnits: data.doseUnit.name,
    frequency: data.frequency.name,
    quantity: data.quantity,
    quantityUnits: data.quantityUnit.name,
    route: data.route.name,
    asNeeded: false,
  }
  let drug: DrugInfo = null
  let concept: Concept = null
  let drugNonCoded = null
  const isCodedDrug = drug => {
    if (drug.concept) return true
    return false
  }
  if (isCodedDrug(data.drug)) {
    drug = {
      form: data.drug.dosageForm.display,
      name: data.drug.name,
      strength: data.drug.strength,
      uuid: data.drug.uuid,
    }
  } else {
    drugNonCoded = data.drug.name
    concept = {
      uuid: data.drug.uuid,
    }
  }

  const autoExpireDate = getExpiredDate(
    data.startDate,
    getDurationInDays(data.duration, data.durationUnit),
  )

  //Todo. when action is implemented
  const drugOrder: NewPrescription = {
    //Todo. action should be revised or refilled or Discontinued based on user action
    action: 'NEW',
    careSetting: 'OUTPATIENT',
    concept: concept,
    dateStopped: null,
    dateActivated: data.dateActivated,
    autoExpireDate: autoExpireDate,
    drug: drug,
    dosingInstructions: dosingInstructions,
    drugNonCoded: drugNonCoded,
    duration: data.duration,
    durationUnits: data.durationUnit.name,
    effectiveStartDate: data.startDate,
    //Todo. effectiveStopDate will be different from autoExpireDate, if it stopped
    effectiveStopDate: autoExpireDate,
    scheduledDate: data.startDate,
  }
  return drugOrder
}

export const createEncounterPayload = (
  locationUuid: String,
  providerUuid: String,
  encounterTypeUuid: String,
  visitType: String,
  drugOrders: NewPrescription[],
) => {
  const encounterPayload: EncounterPayload = {
    locationUuid,
    patientUuid: getPatientUuid(),
    encounterUuid: null,
    visitUuid: null,
    providers: [
      {
        uuid: providerUuid,
      },
    ],
    encounterDateTime: null,
    visitType,
    bahmniDiagnoses: [],
    orders: [],
    drugOrders,
    disposition: null,
    observations: [],
    encounterTypeUuid,
  }
  return encounterPayload
}

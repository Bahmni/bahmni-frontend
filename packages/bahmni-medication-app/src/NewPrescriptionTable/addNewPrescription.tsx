import {is, isType} from '@babel/types'
import {
  DosingInstructions,
  DrugInfo,
  DurationUnit,
  NewPrescription,
} from '../types'

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

export const addNewPrescription = (data): NewPrescription => {
  const dosingInstructions: DosingInstructions = {
    dose: data.dose,
    doseUnits: data.doseUnit.name,
    frequency: data.frequency.name,
    quantity: data.quantity,
    quantityUnits: data.quantityUnit.name,
    route: data.route.name,
  }
  let drug : DrugInfo= null
  let drugNonCoded = null
  const isCodedDrug = drug => {
    if (drug.uuid) return true
    return false
  }
  

  if (isCodedDrug) {
    drug = {
      form: data.drug.dosageForm.display,
      name: data.drug.name,
      strength: data.drug.strength,
      uuid: data.drug.uuid,
    }
  }
  else{
      drugNonCoded = data.drug.name
  }

  const autoExpireDate = getExpiredDate(
    data.startDate,
    getDurationInDays(data.duration, data.durationUnit),
  )

  //Todo. when action is implemented
  const prescription: NewPrescription = {
    //Todo. action should be revised or refilled or Discontinued based on user action
    action: 'NEW',
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
  return prescription
}

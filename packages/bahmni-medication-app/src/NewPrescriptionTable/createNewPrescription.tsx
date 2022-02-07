import {StringSchema} from 'yup'
import {
  DosingInstructions,
  DrugInfo,
  DurationUnit,
  NewPrescription,
} from '../types'

export const createNewPrescription = (prescription): NewPrescription => {
  function getDosingInstructions(): DosingInstructions {
    return {
      dose: prescription.dose,
      doseUnits: prescription.doseUnit.name,
      frequency: prescription.frequency.name,
      quantity: prescription.quantity,
      quantityUnits: prescription.quantityUnit.name,
      route: prescription.route.name,
    }
  }

  let drug: DrugInfo = null
  let drugNonCoded: string = null

  function setDrugInfo() {
    function isCodedDrug(drug) {
      return drug.uuid ? true : false
    }

    if (isCodedDrug(prescription.drug)) {
      drug = {
        form: prescription.drug.dosageForm.display,
        name: prescription.drug.name,
        strength: prescription.drug.strength,
        uuid: prescription.drug.uuid,
      }
    } else {
      drugNonCoded = prescription.drug.name
    }
  }

  function getAutoExpireDate() {
    function getDurationInDays(
      duration: number,
      durationUnit: DurationUnit,
    ): number {
      return duration ? duration * (durationUnit.factor || 1) : Number.NaN
    }

    function getExpiredDate(
      effectiveStartDate: number,
      durationInDays: number,
    ) {
      const d = new Date(effectiveStartDate)
      return d.setDate(d.getDate() + durationInDays)
    }

    return getExpiredDate(
      prescription.startDate,
      getDurationInDays(prescription.duration, prescription.durationUnit),
    )
  }

  setDrugInfo()

  return {
    //Todo. action should be revised or refilled or Discontinued based on user action
    action: 'NEW',
    dateStopped: null,
    dateActivated: prescription.dateActivated,
    autoExpireDate: getAutoExpireDate(),
    drug: drug,
    dosingInstructions: getDosingInstructions(),
    drugNonCoded: drugNonCoded,
    duration: prescription.duration,
    durationUnits: prescription.durationUnit.name,
    effectiveStartDate: prescription.startDate,
    //Todo. effectiveStopDate will be different from autoExpireDate, if it stopped
    effectiveStopDate: getAutoExpireDate(),
    scheduledDate: prescription.startDate,
  }
}

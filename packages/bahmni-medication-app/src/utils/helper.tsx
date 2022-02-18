import {NewPrescription} from '../types'
import {PrescriptionItem} from '../types/medication'

export const getPatientUuid = () => {
  const url = window.location.hash
  const urlArray = url.split('/')
  return urlArray[urlArray.indexOf('patient') + 1]
}

export const getDrugInfo = (
  prescriptionItem: PrescriptionItem | NewPrescription,
) => {
  if (prescriptionItem.drug === null && prescriptionItem.drugNonCoded)
    return `${prescriptionItem.drugNonCoded}, ${prescriptionItem.dosingInstructions.route}`

  return `${prescriptionItem.drug.name}, ${prescriptionItem.drug.form}, ${prescriptionItem.dosingInstructions.route}`
}

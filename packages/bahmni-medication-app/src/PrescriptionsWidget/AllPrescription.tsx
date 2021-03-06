import React from 'react'
import {useAsync} from 'react-async'
import {getAllPrescription} from '../services/bahmnicore'
import {getPatientUuid} from '../utils/helper'
import PrescriptionTable from './PrescriptionTable'
import type {PrescriptionItem} from '../types/medication'
import {InlineLoading} from '@bahmni/design-system'

const AllPrescription = () => {
  const {data, error, isPending} = useAsync<PrescriptionItem[]>({
    promiseFn: getAllPrescription,
    patientUuid: getPatientUuid(),
  })

  //TODO add a common loader and error
  if (isPending)
    return (
      <InlineLoading description="Loading Prescriptions..."></InlineLoading>
    )
  if (error) return <p>{`something went wrong ${error.message}`}</p>
  if (data && data.length > 0) {
    return (
      <div data-testid="allPrescription">
        <PrescriptionTable data={data}></PrescriptionTable>
      </div>
    )
  }

  return <></>
}

export default AllPrescription

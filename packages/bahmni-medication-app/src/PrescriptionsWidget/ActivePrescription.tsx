import React from 'react'
import {useAsync} from 'react-async'
import {getActivePrescription} from '../services/bahmnicore'
import {getPatientUuid} from '../utils/helper'
import PrescriptionTable from './PrescriptionTable'
import type {PrescriptionItem} from '../types/medication'

const ActivePrescription = () => {
  const {data, error, isPending} = useAsync<PrescriptionItem[]>({
    promiseFn: getActivePrescription,
    patientUuid: getPatientUuid(),
  })

  //TODO add a common loader and error
  if (isPending) return <p>Loading...</p>
  if (error) return <p>{`something went wrong ${error.message}`}</p>
  if (data && data.length > 0)
    return (
      <div data-testid="activePrescription">
        <PrescriptionTable data={data.slice().reverse()} />
      </div>
    )

  return <></>
}

export default ActivePrescription

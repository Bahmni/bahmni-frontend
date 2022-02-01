import {Button, InlineLoading, ToastNotification} from '@bahmni/design-system'
import React, {useEffect, useState} from 'react'
import {useAsync} from 'react-async'
import Loader from '../Loader/Loader'
import {createEncounterPayload} from '../NewPrescriptionTable/newPrescriptionHelper'
import {saveNewPrescription} from '../services/bahmnicore'
import {
  getEncounterTypeUuid,
  getProviderUuid,
  getVisitType,
} from '../services/openmrs'

import {NewPrescription} from '../types'
import {useProviderName, useUserLocationUuid} from '../utils/cookie'
import {getPatientUuid} from '../utils/helper'

type SaveMedicationProps = {
  newPrescription: NewPrescription[]
  onSaveSuccess: Function
}

const SaveMedication = (props: SaveMedicationProps) => {
  const providerName = useProviderName()
  const locationUuid = useUserLocationUuid()
  const {data: providerUuid} = useAsync<any>({
    promiseFn: getProviderUuid,
    name: providerName,
  })

  const {data: encounterTypeUuid} = useAsync<any>({
    promiseFn: getEncounterTypeUuid,
  })

  const {data: visitType} = useAsync<any>({
    promiseFn: getVisitType,
    patientUuid: getPatientUuid(),
  })

  const [payloadData, setPayloadData] = useState<any>()
  const {
    run: savedPrescription,
    isPending,
    isFulfilled,
    isRejected,
  } = useAsync<any>({
    deferFn: () => saveNewPrescription(payloadData),
    onResolve: () => props.onSaveSuccess(),
  })

  useEffect(() => {
    if (payloadData) {
      savedPrescription()
    }
  }, [payloadData])

  const payload = async () => {
    if (props.newPrescription.length !== 0) {
      setPayloadData(
        createEncounterPayload(
          locationUuid,
          providerUuid,
          encounterTypeUuid,
          visitType,
          props.newPrescription,
        ),
      )
    }
  }

  return (
    <div>
      {isPending && <Loader />}
      <Button
        style={{float: 'right'}}
        className="confirm"
        onClick={() => {
          payload()
        }}
      >
        Save
      </Button>

      {isFulfilled && (
        <ToastNotification
          lowContrast
          title={'Save Successful'}
          kind={'success'}
          timeout={1000}
          hideCloseButton
        />
      )}
      {isRejected && (
        <ToastNotification
          lowContrast
          title={'Save Failed'}
          kind={'error'}
          timeout={1000}
          hideCloseButton
        />
      )}
    </div>
  )
}

export default SaveMedication

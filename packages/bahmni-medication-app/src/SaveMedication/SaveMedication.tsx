import {Button, ToastNotification} from '@bahmni/design-system'
import React, {useEffect, useState} from 'react'
import {useAsync} from 'react-async'
import {useStoppedPrescriptions} from '../context/StoppedPrescriptionContext'
import Loader from '../Loader/Loader'
import {createEncounterPayload} from '../NewPrescriptionTable/newPrescriptionHelper'
import {saveMedicationEncounter} from '../services/bahmnicore'
import {
  getEncounterTypeUuid,
  getProviderUuid,
  getVisitType,
} from '../services/openmrs'

import type {NewPrescription} from '../types'
import {useProviderName, useUserLocationUuid} from '../utils/cookie'
import {getPatientUuid} from '../utils/helper'

type SaveMedicationProps = {
  newPrescription: NewPrescription[]
  onSaveSuccess: Function
}

const SaveMedication = (props: SaveMedicationProps) => {
  const {providerName} = useProviderName()
  const {locationUuid} = useUserLocationUuid()
  const {data: providerUuid} = useAsync<any>({
    promiseFn: getProviderUuid,
    providerName,
  })

  const {data: encounterTypeUuid} = useAsync<any>({
    promiseFn: getEncounterTypeUuid,
  })

  const {data: visitType} = useAsync<any>({
    promiseFn: getVisitType,
    patientUuid: getPatientUuid(),
  })

  const [payloadData, setPayloadData] = useState<any>()
  const {stoppedPrescriptions, setStoppedPrescriptions} =
    useStoppedPrescriptions()
  const {
    run: savePrescription,
    isPending,
    isFulfilled,
    isRejected,
  } = useAsync<any>({
    deferFn: () => saveMedicationEncounter(payloadData),
    onResolve: () => {
      setStoppedPrescriptions([]), props.onSaveSuccess()
    },
  })

  useEffect(() => {
    if (payloadData) {
      savePrescription()
    }
  }, [payloadData])

  const onSaveClicked = async () => {
    if (props.newPrescription.length > 0 || stoppedPrescriptions.length > 0) {
      setPayloadData(
        createEncounterPayload(
          locationUuid,
          providerUuid,
          encounterTypeUuid,
          visitType,
          [...props.newPrescription, ...stoppedPrescriptions],
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
          onSaveClicked()
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

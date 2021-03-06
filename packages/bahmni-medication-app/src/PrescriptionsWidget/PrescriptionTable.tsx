import {
  Column,
  Grid,
  Link,
  Row,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tag,
} from '@bahmni/design-system'
import React, {useState} from 'react'
import {useStoppedPrescriptions} from '../context/StoppedPrescriptionContext'
import {StopPrescriptionInfo} from '../types'
import {getDrugInfo} from '../utils/helper'
import {headerData} from '../utils/constants'
import StopPrescriptionModal from './StopPrescriptionModal'
import type {PrescriptionItem} from '../types/medication'

type PrescriptionData = {
  data: PrescriptionItem[]
}
const styles = {
  providerName: {
    fontSize: '0.7rem',
    float: 'right',
    paddingTop: '0.625rem',
  } as React.CSSProperties,
  tableSubHeading: {textAlign: 'center'},
  strikeText: {textDecoration: 'line-through'},
}
enum PrescriptionStatus {
  ACTIVE = 'active',
  FINISHED = 'finished',
  SCHEDULED = 'scheduled',
  STOPPED = 'stopped',
}
const StatusStylesMap = {
  active: {color: 'orange'},
  scheduled: {color: 'green'},
}

const getScheduleText = (
  prescription: PrescriptionItem,
  prescriptionStatus: PrescriptionStatus,
): String => {
  const doseInfo: any = prescription.dosingInstructions
  const startDate: String = new Date(
    prescription.effectiveStartDate,
  ).toLocaleDateString()
  const schedule: String = `${doseInfo.dose} ${doseInfo.doseUnits}, ${
    doseInfo.frequency
  } for ${prescription.duration} ${prescription.durationUnits} ${
    prescriptionStatus === PrescriptionStatus.SCHEDULED
      ? 'start on'
      : 'started on'
  } ${startDate}`
  return schedule
}

const renderInstructions = (prescription: PrescriptionItem) => {
  const instructionJson = JSON.parse(
    prescription.dosingInstructions?.administrationInstructions,
  )

  return instructionJson ? (
    <>
      {instructionJson?.instructions && (
        <Tag type="green" title="Instruction">
          {' '}
          {instructionJson?.instructions}{' '}
        </Tag>
      )}
      {instructionJson?.additionalInstructions && (
        <Tag type="blue" title="Instruction">
          {' '}
          {instructionJson?.additionalInstructions}{' '}
        </Tag>
      )}
    </>
  ) : (
    <></>
  )
}

const getPrescriptionStatus = (
  prescription: PrescriptionItem,
): PrescriptionStatus => {
  const currentDateTime = Date.now()
  if (prescription.dateStopped) return PrescriptionStatus.STOPPED
  if (prescription.effectiveStartDate > currentDateTime)
    return PrescriptionStatus.SCHEDULED
  return prescription.effectiveStopDate > currentDateTime
    ? PrescriptionStatus.ACTIVE
    : PrescriptionStatus.FINISHED
}

const PrescriptionTable = (props: PrescriptionData) => {
  const {stoppedPrescriptions, setStoppedPrescriptions} =
    useStoppedPrescriptions()
  const [selectedStopPrescriptionIndex, setSelectedStopPrescriptionIndex] =
    useState<number>(-1)

  const renderPrescriptionActions = (
    status: PrescriptionStatus,
    prescriptionIndex: number,
    currentStopInfo: PrescriptionItem,
  ) => {
    if (isPastPrescription(status)) return <Link inline>add</Link>
    if (currentStopInfo)
      return (
        <Link inline onClick={() => handleUndoStopAction(prescriptionIndex)}>
          undo
        </Link>
      )

    return (
      <>
        <Link inline>revise</Link>{' '}
        <Link
          inline
          onClick={() => setSelectedStopPrescriptionIndex(prescriptionIndex)}
        >
          stop
        </Link>{' '}
        <Link inline>renew</Link>{' '}
      </>
    )
  }
  function isPastPrescription(status: PrescriptionStatus) {
    return (
      status === PrescriptionStatus.FINISHED ||
      status === PrescriptionStatus.STOPPED
    )
  }
  function isStopActionClicked() {
    return selectedStopPrescriptionIndex >= 0
  }

  function renderStoppedPrecriptionInfo(
    stopInfo: PrescriptionItem,
  ): React.ReactNode {
    return (
      <TableRow style={{borderTop: 'hidden'}}>
        <TableCell colSpan={6}>
          <Grid>
            <Row>
              <Column>
                {`Stop Date : ${new Date(
                  stopInfo.dateStopped,
                ).toLocaleDateString()} `}{' '}
              </Column>
              <Column>{`Reason : ${
                stopInfo.orderReasonConcept?.name ?? '-'
              }`}</Column>
              <Column>{`Notes: ${stopInfo.orderReasonText}`}</Column>
            </Row>
          </Grid>{' '}
        </TableCell>
      </TableRow>
    )
  }

  const prescriptionActivatedDate = (index: number) =>
    new Date(props.data[index].dateActivated).toLocaleDateString()

  const isPrescriptionDateHeaderRequired = (currentRow: number) => {
    const firstEntry = () => currentRow == 0

    return (
      firstEntry() ||
      prescriptionActivatedDate(currentRow) !=
        prescriptionActivatedDate(currentRow - 1)
    )
  }

  const renderPrescriptionDateHeader = (currentRow: number) => {
    return (
      <TableRow aria-label="Prescription Date Header">
        <TableCell colSpan={6} style={styles.tableSubHeading}>
          {prescriptionActivatedDate(currentRow)}
        </TableCell>
      </TableRow>
    )
  }

  const handleStopPrescriptionModalClose = (
    stopPrescriptionInfo: StopPrescriptionInfo,
  ) => {
    if (stopPrescriptionInfo) {
      setStoppedPrescriptions([
        ...stoppedPrescriptions,
        getStoppedPrescriptionItem(),
      ])
    }
    setSelectedStopPrescriptionIndex(-1)

    function getStoppedPrescriptionItem(): PrescriptionItem {
      let stoppedPrescriptionItem = JSON.parse(
        JSON.stringify(props.data[selectedStopPrescriptionIndex]),
      )
      stoppedPrescriptionItem.action = 'DISCONTINUE'
      stoppedPrescriptionItem.dateActivated = null
      stoppedPrescriptionItem.dateStopped = stopPrescriptionInfo.stopDate
      stoppedPrescriptionItem.previousOrderUuid = stoppedPrescriptionItem.uuid
      stoppedPrescriptionItem.uuid = null
      stoppedPrescriptionItem.orderReasonText = stopPrescriptionInfo.notes

      //TODO Update setting orderReasonConcept based on stopData.reason
      stoppedPrescriptionItem.orderReasonConcept = null
      return stoppedPrescriptionItem
    }
  }

  const handleUndoStopAction = (index: number) => {
    const removedArray = stoppedPrescriptions.filter(
      item => item.previousOrderUuid != props.data[index].uuid,
    )
    setStoppedPrescriptions(removedArray)
  }

  const getCurrentStopInfo = (
    prescriptionItem: PrescriptionItem,
    prescriptionStatus: PrescriptionStatus,
  ): PrescriptionItem => {
    if (isPastPrescription(prescriptionStatus)) return undefined

    return stoppedPrescriptions.find(
      item => item.previousOrderUuid === prescriptionItem.uuid,
    )
  }

  return (
    <>
      <Table title="prescription">
        <TableHead>
          <TableRow>
            {headerData.map((header, i) => (
              <TableHeader key={i}>{header}</TableHeader>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data.map((row, index) => {
            const prescriptionStatus = getPrescriptionStatus(row)
            let currentStopInfo = getCurrentStopInfo(row, prescriptionStatus)
            return (
              <React.Fragment key={Math.random()}>
                {isPrescriptionDateHeaderRequired(index) &&
                  renderPrescriptionDateHeader(index)}
                <TableRow>
                  <TableCell
                    style={
                      (prescriptionStatus === PrescriptionStatus.STOPPED ||
                        currentStopInfo) &&
                      styles.strikeText
                    }
                  >
                    {getDrugInfo(row)}
                  </TableCell>
                  <TableCell
                    style={
                      (prescriptionStatus === PrescriptionStatus.STOPPED ||
                        currentStopInfo) &&
                      styles.strikeText
                    }
                  >
                    {getScheduleText(row, prescriptionStatus)}
                    <small style={styles.providerName}>
                      by {row.provider.name}
                    </small>
                  </TableCell>
                  <TableCell>
                    {row.dosingInstructions.quantity}{' '}
                    {row.dosingInstructions.quantityUnits}
                  </TableCell>
                  <TableCell>{renderInstructions(row)}</TableCell>
                  <TableCell
                    style={{
                      color: StatusStylesMap[prescriptionStatus]?.color,
                      fontWeight: 'bold',
                    }}
                  >
                    {prescriptionStatus}
                  </TableCell>
                  <TableCell>
                    {renderPrescriptionActions(
                      prescriptionStatus,
                      index,
                      currentStopInfo,
                    )}
                  </TableCell>
                </TableRow>
                {currentStopInfo &&
                  renderStoppedPrecriptionInfo(currentStopInfo)}
              </React.Fragment>
            )
          })}
        </TableBody>
      </Table>
      {isStopActionClicked() && (
        <StopPrescriptionModal
          prescription={props.data[selectedStopPrescriptionIndex]}
          onClose={(stopPrescriptionInfo: StopPrescriptionInfo) =>
            handleStopPrescriptionModalClose(stopPrescriptionInfo)
          }
        />
      )}
    </>
  )
}
export default PrescriptionTable

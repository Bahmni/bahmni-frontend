import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Link,
  Tag,
} from '@bahmni/design-system'
import React from 'react'
import {headerData} from '../utils/constants'
import {getDrugInfo} from '../utils/helper'
import {PrescriptionItem} from '../types/medication'

interface PrescriptionData {
  data: PrescriptionItem[]
}
const styles = {
  providerName: {
    fontSize: '0.7rem',
    float: 'right',
    paddingTop: '10px',
  } as React.CSSProperties,
  tableSubHeading: {textAlign: 'center'},
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
  stopped: {textDecoration: 'line-through'},
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

const renderPrescriptionActions = (status: PrescriptionStatus) => {
  return isPastPrescription() ? (
    <Link inline>add</Link>
  ) : (
    <>
      <Link inline>revise</Link> <Link inline>stop</Link>
      <Link inline>renew</Link>{' '}
    </>
  )

  function isPastPrescription() {
    return (
      status === PrescriptionStatus.FINISHED ||
      status === PrescriptionStatus.STOPPED
    )
  }
}

const PrescriptionTable = (props: PrescriptionData) => {
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

  return (
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
          return (
            <React.Fragment key={Math.random()}>
              {isPrescriptionDateHeaderRequired(index) &&
                renderPrescriptionDateHeader(index)}
              <TableRow>
                <TableCell
                  style={{
                    textDecoration:
                      StatusStylesMap[prescriptionStatus]?.textDecoration,
                  }}
                >
                  {getDrugInfo(row)}
                </TableCell>
                <TableCell
                  style={{
                    textDecoration:
                      StatusStylesMap[prescriptionStatus]?.textDecoration,
                  }}
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
                  {renderPrescriptionActions(prescriptionStatus)}
                </TableCell>
              </TableRow>
            </React.Fragment>
          )
        })}
      </TableBody>
    </Table>
  )
}
export default PrescriptionTable

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
import {PrescriptionItem} from '../types/medication'

const styles = {
  providerName: {
    fontSize: '0.7rem',
    float: 'right',
    paddingTop: '10px',
  } as React.CSSProperties,
  tableSubHeading: {textAlign: 'center'},
}
enum DrugStatus {
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

const getScheduleText = (drugInfo: any, drugStatus: DrugStatus) => {
  const doseInfo: any = drugInfo.dosingInstructions
  const startDate: String = new Date(
    drugInfo.effectiveStartDate,
  ).toLocaleDateString()
  const schedule: String = `${doseInfo.dose} ${doseInfo.doseUnits}, ${
    doseInfo.frequency
  } for ${drugInfo.duration} ${drugInfo.durationUnits} ${
    drugStatus === DrugStatus.SCHEDULED ? 'start on' : 'started on'
  } ${startDate}`
  return schedule
}

const getSubHeading = (prescriptionData, index) => {
  if (
    index == 0 ||
    new Date(prescriptionData[index - 1].dateActivated).toLocaleDateString() !==
      new Date(prescriptionData[index].dateActivated).toLocaleDateString()
  ) {
    return (
      <TableRow data-testid="date-row">
        <TableCell colSpan={6} style={styles.tableSubHeading}>
          {new Date(prescriptionData[index].dateActivated).toLocaleDateString()}
        </TableCell>
      </TableRow>
    )
  }
}

const getAdditionalInstruction = (row: PrescriptionItem) => {
  const instructionJson = JSON.parse(
    row.dosingInstructions.administrationInstructions,
  )
  return (
    <>
      <Tag type="green" title="Instruction">
        {' '}
        {instructionJson.instructions}{' '}
      </Tag>
      {instructionJson.additionalInstructions && (
        <Tag type="blue" title="Instruction">
          {' '}
          {instructionJson.additionalInstructions}{' '}
        </Tag>
      )}
    </>
  )
}

const getStatus = (row: PrescriptionItem): DrugStatus => {
  const currentDateTime = Date.now()
  if (row.dateStopped) return DrugStatus.STOPPED
  if (row.effectiveStartDate > currentDateTime) return DrugStatus.SCHEDULED
  return row.effectiveStopDate > currentDateTime
    ? DrugStatus.ACTIVE
    : DrugStatus.FINISHED
}

const getActionLinks = (status: DrugStatus) => {
  return status === DrugStatus.FINISHED || status === DrugStatus.STOPPED ? (
    <Link inline>add</Link>
  ) : (
    <>
      <Link inline>revise</Link> <Link inline>stop</Link>
      <Link inline>renew</Link>{' '}
    </>
  )
}

const getDrugInfo = row => {
  if (row.drug === null && row.drugNonCoded) return row.drugNonCoded

  return ` ${row.drug.name}, ${row.drug.form}, ${row.dosingInstructions.route}`
}
interface PrescriptionData {
  data: PrescriptionItem[]
}

const PrescriptionTable = (props: PrescriptionData) => {
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
          const drugStatus = getStatus(row)
          return (
            <React.Fragment key={Math.random()}>
              {getSubHeading(props.data, index)}
              <TableRow>
                <TableCell
                  style={{
                    textDecoration: StatusStylesMap[drugStatus]?.textDecoration,
                  }}
                >
                  {getDrugInfo(row)}
                </TableCell>
                <TableCell
                  style={{
                    textDecoration: StatusStylesMap[drugStatus]?.textDecoration,
                  }}
                >
                  {getScheduleText(row, drugStatus)}
                  <small style={styles.providerName}>
                    by {row.provider.name}
                  </small>
                </TableCell>
                <TableCell>
                  {row.dosingInstructions.quantity}{' '}
                  {row.dosingInstructions.quantityUnits}
                </TableCell>
                <TableCell>{getAdditionalInstruction(row)}</TableCell>
                <TableCell
                  style={{
                    color: StatusStylesMap[drugStatus]?.color,
                    fontWeight: 'bold',
                  }}
                >
                  {drugStatus}
                </TableCell>
                <TableCell>{getActionLinks(drugStatus)}</TableCell>
              </TableRow>
            </React.Fragment>
          )
        })}
      </TableBody>
    </Table>
  )
}
export default PrescriptionTable

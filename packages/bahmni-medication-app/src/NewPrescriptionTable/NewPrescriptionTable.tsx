import {
  Close24,
  Link,
  Star24,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from '@bahmni/design-system'
import React from 'react'
import {NewPrescription} from '../types'
import {newPrescriptionHeader} from '../utils/constants'
import {getDrugInfo} from '../utils/helper'

const styles = {
  action: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  tablePos: {marginTop: '5rem', padding: '16px'},
}

const getScheduleText = (prescriptionItem: any) => {
  const doseInfo: any = prescriptionItem.dosingInstructions
  const startDate: String = new Date(
    prescriptionItem.effectiveStartDate,
  ).toLocaleDateString()
  const schedule: String = `${doseInfo.dose} ${doseInfo.doseUnits}, ${doseInfo.frequency} for ${prescriptionItem.duration} ${prescriptionItem.durationUnits} starting on ${startDate}`
  return schedule
}

const NewPrescriptionTable = React.memo(
  (props: {data: NewPrescription[]; setData: Function}) => {
    const handleDelete = (index: number) => {
      if (window.confirm('Are you sure you want to remove?')) {
        props.setData(props.data.filter(data => data != props.data[index]))
      }
    }

    return props.data.length > 0 ? (
      <div style={styles.tablePos}>
        <TableContainer title="New Prescription">
          <Table title="newPrescription">
            <TableHead>
              <TableRow>
                {newPrescriptionHeader.map((header, i) => (
                  <TableHeader key={i}>{header}</TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {props.data.map((row, index) => (
                <React.Fragment key={Math.random()}>
                  <TableRow aria-label="prescription">
                    <TableCell>{getDrugInfo(row)}</TableCell>
                    <TableCell>{getScheduleText(row)}</TableCell>
                    <TableCell>
                      {row.dosingInstructions.quantity}{' '}
                      {row.dosingInstructions.quantityUnits}
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      <span style={styles.action}>
                        <Link>edit</Link>
                        <Star24 aria-label="favourite" />
                        <Close24
                          aria-label="delete"
                          onClick={() => {
                            handleDelete(index)
                          }}
                        />
                      </span>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    ) : (
      <></>
    )
  },
)

export default NewPrescriptionTable

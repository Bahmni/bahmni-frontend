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
import {schedule} from '../PrescriptionsWidget/PrescriptionTable'
import {NewPrescription} from '../types'
import {newPrescriptionHeader} from '../utils/constants'

const styles = {
  action: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  tablePos: {marginTop: '10rem', padding: '16px'},
}

interface PrescriptionData {
  data: NewPrescription[]
}

const NewPrescriptionTable = React.memo((props: PrescriptionData) => {
  return (
    props.data.length > 0 && (
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
            {console.log(props.data)}
            <TableBody>
              {props.data
                .slice()
                .reverse()
                .map(row => (
                  <React.Fragment key={Math.random()}>
                    <TableRow>
                      <TableCell>
                        {row.drug.name}, {row.drug.form},{' '}
                        {row.dosingInstructions.route}
                      </TableCell>
                      <TableCell>{schedule(row)}</TableCell>
                      <TableCell>
                        {row.dosingInstructions.quantity}{' '}
                        {row.dosingInstructions.quantityUnits}
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell>
                        <span style={styles.action}>
                          <Link>edit</Link>
                          <Star24 />
                          <Close24 />
                        </span>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    )
  )
})

export default NewPrescriptionTable

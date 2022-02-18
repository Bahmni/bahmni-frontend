import {
  Close24,
  Link,
  Modal,
  Star24,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from '@bahmni/design-system'
import React, {useState} from 'react'
import AddPrescriptionModal from '../AddPrescriptionModal/AddPrescriptionModal'
import {NewPrescription} from '../types'
import {newPrescriptionHeader} from '../utils/constants'
import {getDrugInfo} from '../utils/helper'
import {createNewPrescription} from './createNewPrescription'

interface NewPrescriptionProps {
  newPrescriptions: NewPrescription[]
  setNewPrescriptions: Function
}

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

const NewPrescriptionTable = ({
  newPrescriptions,
  setNewPrescriptions,
}: NewPrescriptionProps) => {
  const [selectedIndexForEdit, setSelectedIndexForEdit] = useState(-1)

  const handleDelete = (index: number) => {
    if (window.confirm('Are you sure you want to remove?')) {
      setNewPrescriptions(
        newPrescriptions.filter(
          newPrescription => newPrescription != newPrescriptions[index],
        ),
      )
    }
  }
  const isEditActionClicked = (): boolean => {
    return selectedIndexForEdit >= 0
  }

  function handlePrescriptionUpdate(updatedPrescriptionInfo) {
    const updatedPrescription = createNewPrescription(updatedPrescriptionInfo)
    let temp = [...newPrescriptions]
    temp[selectedIndexForEdit] = updatedPrescription
    setNewPrescriptions(temp)
    setSelectedIndexForEdit(-1)
  }

  return newPrescriptions.length > 0 ? (
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
            {newPrescriptions.map((row, index) => (
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
                      <Link onClick={() => setSelectedIndexForEdit(index)}>
                        edit
                      </Link>
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
      {isEditActionClicked() && (
        <Modal>
          <AddPrescriptionModal
            newPrescriptionForEdit={newPrescriptions[selectedIndexForEdit]}
            onClose={() => setSelectedIndexForEdit(-1)}
            onDone={updatedPrescriptionInfo => {
              handlePrescriptionUpdate(updatedPrescriptionInfo)
            }}
          ></AddPrescriptionModal>
        </Modal>
      )}
    </div>
  ) : (
    <></>
  )
}

export default NewPrescriptionTable

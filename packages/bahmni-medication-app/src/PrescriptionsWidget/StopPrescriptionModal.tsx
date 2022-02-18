import {
  Button,
  Column,
  ComboBox,
  DatePicker,
  DatePickerInput,
  Grid,
  Row,
  TextArea,
} from '@bahmni/design-system'
import React, {useState} from 'react'
import {PrescriptionItem} from '../types/medication'
import {stopReasons} from '../utils/constants'
import {getDrugInfo} from '../utils/helper'

const styles = {
  modal_container: {
    border: '2px solid #f4f4f4',
    position: 'fixed',
    zIndex: 1,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    overflow: 'auto',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  } as React.CSSProperties,
  modal_content: {
    backgroundColor: '#fefefe',
    margin: '15% auto',
    padding: '1.25rem',
    border: '1px solid #888',
    width: '50%',
  },
  row: {
    marginBottom: '1.25rem',
  },
  cancel_button: {
    backgroundColor: 'grey',
    color: 'black',
  },
  right_align: {
    textAlign: 'right',
  },
}

type StopPrescriptionModalProps = {
  prescription: PrescriptionItem
  onClose: Function
}

const StopPrescriptionModal = (props: StopPrescriptionModalProps) => {
  const [stopDate, setStopDate] = useState<Date>(new Date())
  const [reason, setReason] = useState<string>()
  const [notes, setNotes] = useState<string>()
  const locale: string = 'en'
  const currentDate: string = new Date().toLocaleDateString(locale)
  return (
    <div style={styles.modal_container} title="stopPrescriptionModal">
      <div style={styles.modal_content}>
        <Grid>
          <Row style={styles.row}>{getDrugInfo(props.prescription)}</Row>
          <Row style={styles.row}>
            <Column>
              <DatePicker
                datePickerType="single"
                locale={locale}
                value={stopDate}
                short={true}
                minDate={currentDate}
                maxDate={new Date(
                  props.prescription.effectiveStopDate,
                ).toLocaleDateString(locale)}
                onChange={(selectedDate: Date[]) => {
                  setStopDate(selectedDate[0])
                }}
              >
                <DatePickerInput
                  placeholder="mm/dd/yyyy"
                  labelText="Stop Date"
                  id="stopDate"
                />
              </DatePicker>
            </Column>
            <Column>
              <ComboBox
                items={stopReasons}
                placeholder="Reason..."
                titleText="Stop Reason"
                onChange={(event: {selectedItem: string}) => {
                  setReason(event.selectedItem)
                }}
                id="stop-reason-input"
              />
            </Column>
            <Column>
              <TextArea
                labelText="Notes"
                id="stop-notes"
                rows={1}
                onChange={(e: {target: {value: string}}) => {
                  setNotes(e.target.value)
                }}
              ></TextArea>
            </Column>
          </Row>
          <Row title="actionButtons" style={styles.row}>
            <Column>
              <Button
                style={styles.cancel_button}
                onClick={() => props.onClose(null)}
              >
                Cancel
              </Button>
            </Column>
            <Column style={styles.right_align}>
              <Button
                className="confirm"
                onClick={() =>
                  props.onClose({
                    stopDate,
                    reason: reason ?? '-',
                    notes: notes ?? '-',
                  })
                }
                disabled={!stopDate}
              >
                Done
              </Button>
            </Column>
          </Row>
        </Grid>
      </div>
    </div>
  )
}

export default StopPrescriptionModal

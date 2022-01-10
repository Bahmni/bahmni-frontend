import {
  Button,
  Column,
  ComboBox,
  DatePicker,
  DatePickerInput,
  Dropdown,
  Grid,
  InlineLoading,
  NumberInput,
  Row,
} from '@bahmni/design-system'
import React from 'react'
import useDrugOrderConfig from '../hooks/useDrugOrderConfig'
import {Drug, Frequency, Route, Unit} from '../types'

type AddPrescriptionModalProps = {
  drug: Drug
  onClose: Function
}

const styles = {
  dialog_container: {
    border: '2px solid #f4f4f4',
  },
  row: {
    marginBottom: '20px',
  },
  cancel_button: {
    backgroundColor: 'grey',
    color: 'black',
  },
  right_align: {
    textAlign: 'right',
  },
}
const AddPrescriptionModal = (props: AddPrescriptionModalProps) => {
  const {drugOrderConfig, isLoading, error} = useDrugOrderConfig()
  const locale: string = 'en'
  const currentDate: string = new Date().toLocaleDateString(locale)
  if (error) return <p>Something went wrong..</p>
  if (isLoading)
    return <InlineLoading description="Loading Data..."></InlineLoading>
  if (
    drugOrderConfig.doseUnits &&
    drugOrderConfig.durationUnits &&
    drugOrderConfig.frequencies &&
    drugOrderConfig.routes
  )
    return (
      <div style={styles.dialog_container} title="prescriptionDialog">
        <Grid>
          <Row title="drugName" style={styles.row}>
            <Column>
              <h5>{props.drug.name}</h5>
            </Column>
          </Row>
          <Row title="prescriptionDetails" style={styles.row}>
            <Column sm={4} md={6} lg={9}>
              <Row style={styles.row}>
                <Column>
                  <Row>
                    <Column sm={1}>
                      <NumberInput
                        id="dosage"
                        label="Dosage"
                        hideSteppers={true}
                        min={0}
                        invalidText="Dosage cannot be less than 0"
                      ></NumberInput>
                    </Column>
                    <Column sm={3}>
                      <Dropdown
                        id="dosageUnit"
                        label="Dosage Unit"
                        titleText="Units"
                        items={drugOrderConfig.doseUnits}
                        ariaLabel="Dosage Unit"
                        itemToString={(item: Unit) => item.name}
                      />
                    </Column>
                  </Row>
                </Column>
                <Column>
                  <ComboBox
                    id="frequencySearch"
                    titleText="Frequency"
                    placeholder="Select Frequency"
                    onChange={() => {}}
                    items={drugOrderConfig.frequencies}
                    itemToString={(item: Frequency) => (item ? item.name : '')}
                  ></ComboBox>
                </Column>
                <Column>
                  <Row>
                    <Column sm={1}>
                      <NumberInput
                        id="duration"
                        label="Duration"
                        hideSteppers={true}
                        min={0}
                        invalidText="Duration cannot be less than 0"
                      ></NumberInput>
                    </Column>
                    <Column sm={3}>
                      <Dropdown
                        id="durationUnit"
                        label="Duration Unit"
                        titleText="Units"
                        items={drugOrderConfig.durationUnits}
                        ariaLabel="Duration Unit"
                        itemToString={(item: Unit) => item.name}
                      />
                    </Column>
                  </Row>
                </Column>
              </Row>

              <Row>
                <Column>
                  <DatePicker
                    datePickerType="single"
                    locale={locale}
                    short={true}
                    value={currentDate}
                    minDate={currentDate}
                  >
                    <DatePickerInput
                      placeholder="dd/mm/yyyy"
                      labelText="Start Date"
                      id="startDate"
                    />
                  </DatePicker>
                </Column>

                <Column>
                  <Row>
                    <Column sm={1}>
                      <NumberInput
                        id="quantity"
                        label="Quantity"
                        hideSteppers={true}
                        min={0}
                        invalidText="Quantity cannot be less than 0"
                      ></NumberInput>
                    </Column>
                    <Column sm={3}>
                      <Dropdown
                        id="quantityUnit"
                        label="Quantity Unit"
                        titleText="Units"
                        items={drugOrderConfig.doseUnits}
                        ariaLabel="Quantity Unit"
                        itemToString={(item: Unit) => item.name}
                      />
                    </Column>
                  </Row>
                </Column>
                <Column>
                  <Dropdown
                    id="route"
                    label="Route"
                    titleText="Route"
                    items={drugOrderConfig.routes}
                    itemToString={(item: Route) => item.name}
                  />
                </Column>
              </Row>
            </Column>
            <Column sm={4} md={2} lg={3}>
              <h5>PRN</h5>
            </Column>
          </Row>
          <Row title="actionButtons" style={styles.row}>
            <Column>
              <Button style={styles.cancel_button} onClick={props.onClose}>
                Cancel
              </Button>
            </Column>
            <Column style={styles.right_align}>
              <Button className="confirm" onClick={props.onClose}>
                Done
              </Button>
            </Column>
          </Row>
        </Grid>
      </div>
    )
  return <p>Something went wrong..</p>
}

export default AddPrescriptionModal

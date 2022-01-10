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
import React, {useEffect, useState} from 'react'
import useDrugOrderConfig from '../hooks/useDrugOrderConfig'
import {Drug, DurationUnit, Frequency, Route, Unit} from '../types'
import {defaultDurationUnits} from '../utils/constants'

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
  const [dose, setDose] = useState<number>(0)
  const [doseUnit, setDoseUnit] = useState<Unit>()
  const [duration, setDuration] = useState<number>(0)
  const [durationUnit, setDurationUnit] = useState<DurationUnit>()
  const [frequency, setFrequency] = useState<Frequency>()
  const [startDate, setStartDate] = useState<Date>(new Date())
  const [quantity, setQuantity] = useState<number>(0)
  const [quantityUnit, setQuantityUnit] = useState<Unit>()
  const [route, setRoute] = useState<Route>()
  const [isDataValid, setIsDataValid] = useState<boolean>(false)

  useEffect(() => {
    if (dose > 0 && duration > 0 && durationUnit && frequency) {
      setQuantity(
        Math.ceil(
          dose * duration * durationUnit.factor * frequency.frequencyPerDay,
        ),
      )
    } else {
      setQuantity(0)
    }
  }, [dose, duration, durationUnit, frequency])

  useEffect(() => {
    dose > 0 &&
    doseUnit &&
    duration > 0 &&
    durationUnit &&
    frequency &&
    startDate &&
    quantity > 0 &&
    quantityUnit &&
    route
      ? setIsDataValid(true)
      : setIsDataValid(false)
  }, [
    dose,
    doseUnit,
    duration,
    durationUnit,
    frequency,
    startDate,
    quantity,
    quantityUnit,
    route,
  ])

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
                        onChange={(event: {target: HTMLInputElement}) =>
                          setDose(parseFloat(event.target.value))
                        }
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
                        onChange={(event: {selectedItem: Unit}) => {
                          setDoseUnit(event.selectedItem)
                          setQuantityUnit(event.selectedItem)
                        }}
                      />
                    </Column>
                  </Row>
                </Column>
                <Column>
                  <ComboBox
                    id="frequencySearch"
                    titleText="Frequency"
                    placeholder="Select Frequency"
                    onChange={(event: {selectedItem: Frequency}) => {
                      setFrequency(event.selectedItem)
                    }}
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
                        onChange={(event: {target: HTMLInputElement}) =>
                          setDuration(parseFloat(event.target.value))
                        }
                      ></NumberInput>
                    </Column>
                    <Column sm={3}>
                      <Dropdown
                        id="durationUnit"
                        label="Duration Unit"
                        titleText="Units"
                        items={defaultDurationUnits}
                        ariaLabel="Duration Unit"
                        itemToString={(item: DurationUnit) => item.name}
                        onChange={(event: {selectedItem: DurationUnit}) => {
                          setDurationUnit(event.selectedItem)
                        }}
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
                    onChange={(selectedDate: Date[]) => {
                      setStartDate(selectedDate[0])
                    }}
                  >
                    <DatePickerInput
                      placeholder="mm/dd/yyyy"
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
                        value={isNaN(quantity) ? 0 : quantity}
                        onChange={(event: {target: HTMLInputElement}) =>
                          setQuantity(parseFloat(event.target.value))
                        }
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
                        selectedItem={quantityUnit}
                        onChange={(event: {selectedItem: Unit}) => {
                          setQuantityUnit(event.selectedItem)
                        }}
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
                    onChange={(event: {selectedItem: Route}) => {
                      setRoute(event.selectedItem)
                    }}
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
              <Button
                className="confirm"
                disabled={!isDataValid}
                onClick={() => {
                  console.log(
                    dose,
                    doseUnit,
                    duration,
                    durationUnit,
                    quantity,
                    quantityUnit,
                    frequency,
                    route,
                    startDate,
                  )
                  props.onClose()
                }}
              >
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

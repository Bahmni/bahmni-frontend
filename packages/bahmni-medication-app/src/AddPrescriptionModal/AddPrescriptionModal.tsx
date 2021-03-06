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
import useMedicationConfig from '../hooks/useMedicationConfig'
import type {
  Drug,
  DurationUnit,
  Frequency,
  Route,
  Unit,
  NonCodedDrug,
  NewPrescription,
} from '../types'
import {defaultDurationUnits} from '../utils/constants'

type AddPrescriptionModalProps = {
  drug?: Drug | NonCodedDrug
  newPrescriptionForEdit?: NewPrescription
  onClose: Function
  onDone: Function
}

const styles = {
  dialog_container: {
    border: '2px solid #f4f4f4',
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
const AddPrescriptionModal = (props: AddPrescriptionModalProps) => {
  const {medicationConfig, isMedicationConfigLoading, medicationConfigError} =
    useMedicationConfig()
  const {drugOrderConfig, isLoading, error} = useDrugOrderConfig()
  const locale: string = 'en'
  const currentDate: string = new Date().toLocaleDateString(locale)
  const [dose, setDose] = useState<number>(0)
  const [doseUnit, setDoseUnit] = useState<Unit>()
  const [duration, setDuration] = useState<number>(0)
  const [durationUnit, setDurationUnit] = useState<DurationUnit>()
  const [frequency, setFrequency] = useState<Frequency>()
  const [startDate, setStartDate] = useState<number>(Date.now())
  const [quantity, setQuantity] = useState<number>(0)
  const [quantityUnit, setQuantityUnit] = useState<Unit>()
  const [route, setRoute] = useState<Route>()
  const [isDataValid, setIsDataValid] = useState<boolean>(false)
  const [isDoseUnitAndRouteSet, setIsDoseUnitAndRouteSet] =
    useState<boolean>(false)
  const [isQuantitySetFromEditInfo, setIsQuantitySetFromEditInfo] =
    useState<boolean>(false)

  function getDrug() {
    if (props.drug) return props.drug
    if (isEditPrescription())
      return (
        props.newPrescriptionForEdit.drug || {
          name: props.newPrescriptionForEdit.drugNonCoded,
          uuid: props.newPrescriptionForEdit.concept.uuid,
        }
      )
  }

  function isEditPrescription(): boolean {
    return props.newPrescriptionForEdit !== undefined
  }

  function intialiseValuesForEdit() {
    const editPrescriptionInfo = props.newPrescriptionForEdit
    setDose(editPrescriptionInfo.dosingInstructions.dose)
    setDoseUnit(
      drugOrderConfig.doseUnits.find(
        unit => unit.name === editPrescriptionInfo.dosingInstructions.doseUnits,
      ),
    )
    setDuration(editPrescriptionInfo.duration)
    setDurationUnit(
      defaultDurationUnits.find(
        unit => unit.name === editPrescriptionInfo.durationUnits,
      ),
    )
    setFrequency(
      drugOrderConfig.frequencies.find(
        frequency =>
          frequency.name === editPrescriptionInfo.dosingInstructions.frequency,
      ),
    )
    setStartDate(editPrescriptionInfo.effectiveStartDate)
    setQuantity(editPrescriptionInfo.dosingInstructions.quantity)
    setQuantityUnit(
      drugOrderConfig.doseUnits.find(
        unit =>
          unit.name === editPrescriptionInfo.dosingInstructions.quantityUnits,
      ),
    )
    setRoute(
      drugOrderConfig.routes.find(
        route => route.name === editPrescriptionInfo.dosingInstructions.route,
      ),
    )
  }

  function isQuantityAutoCalculateEnabled(): boolean {
    return !isEditPrescription() || isQuantitySetFromEditInfo
  }

  useEffect(() => {
    if (isEditPrescription() && drugOrderConfig) intialiseValuesForEdit()
  }, [drugOrderConfig])

  useEffect(() => {
    if (isEditPrescription() && quantity > 0) {
      setIsQuantitySetFromEditInfo(true)
    }
  }, [quantity])

  useEffect(() => {
    if (isQuantityAutoCalculateEnabled()) {
      if (dose > 0 && duration > 0 && durationUnit && frequency) {
        setQuantity(
          Math.ceil(
            dose * duration * durationUnit.factor * frequency.frequencyPerDay,
          ),
        )
      } else {
        setQuantity(0)
      }
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

  useEffect(() => {
    if (
      !isEditPrescription() &&
      props.drug.dosageForm &&
      drugOrderConfig &&
      medicationConfig
    ) {
      if (!isDoseUnitAndRouteSet) setDefaultUnitAndRoute()
    }
  }, [drugOrderConfig, medicationConfig])

  useEffect(() => {
    frequency && setDefaultDurationUnit()
  }, [frequency])

  const getInputOptionsConfig = () => {
    // TODO: Refactor to get inputOptionsConfig based on tabConfigName
    return medicationConfig?.tabConfig?.allMedicationTabConfig
      ?.inputOptionsConfig
  }
  const setDefaultUnitAndRoute = () => {
    let drugFormDefaults = getInputOptionsConfig()?.drugFormDefaults
    if (drugFormDefaults) {
      let dosageFormMapping = drugFormDefaults[props.drug.dosageForm.display]
      if (dosageFormMapping?.doseUnits) {
        let defaultDoseUnit = drugOrderConfig.doseUnits.find(
          unit => unit.name === dosageFormMapping.doseUnits,
        )

        setDoseUnit(defaultDoseUnit)
        setQuantityUnit(defaultDoseUnit)
      }
      if (dosageFormMapping?.route) {
        let defaultRoute = drugOrderConfig.routes.find(
          unit => unit.name === dosageFormMapping.route,
        )
        setRoute(defaultRoute)
      }
      setIsDoseUnitAndRouteSet(true)
    }
  }

  const setDefaultDurationUnit = () => {
    let frequencyDefaultDurationUnitsMap =
      getInputOptionsConfig()?.frequencyDefaultDurationUnitsMap

    frequencyDefaultDurationUnitsMap?.forEach(durationUnitMap => {
      let minFrequency = eval(durationUnitMap.minFrequency) // eslint-disable-line no-eval
      let maxFrequency = eval(durationUnitMap.maxFrequency) // eslint-disable-line no-eval
      if (
        (!minFrequency || frequency.frequencyPerDay > minFrequency) &&
        (!maxFrequency || frequency.frequencyPerDay <= maxFrequency)
      ) {
        setDurationUnit(
          defaultDurationUnits.find(
            unit => unit.name === durationUnitMap.defaultDurationUnit,
          ),
        )
      }
    })
  }

  const getDrugInstruction = () => {
    return {
      dateActivated: Date.now(),
      drug: getDrug(),
      dose: dose,
      doseUnit: doseUnit,
      duration: duration,
      durationUnit: durationUnit,
      quantity: quantity,
      quantityUnit: quantityUnit,
      frequency: frequency,
      route: route,
      startDate: startDate,
    }
  }

  if (error) return <p>Something went wrong..</p>
  if (isLoading || isMedicationConfigLoading)
    return <InlineLoading description="Loading Data..."></InlineLoading>
  if (
    drugOrderConfig &&
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
              <h5>{getDrug().name}</h5>
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
                        value={isNaN(dose) ? 0 : dose}
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
                        selectedItem={doseUnit}
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
                    selectedItem={frequency ?? ''}
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
                        value={isNaN(duration) ? 0 : duration}
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
                        selectedItem={durationUnit}
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
                    value={new Date(startDate)}
                    minDate={currentDate}
                    onChange={(selectedDate: Date[]) => {
                      setStartDate(Date.parse(selectedDate[0].toString()))
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
                    selectedItem={route}
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
                  props.onDone(getDrugInstruction())
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

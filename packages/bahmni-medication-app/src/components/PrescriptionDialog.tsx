import {
  Button,
  Column,
  DatePicker,
  DatePickerInput,
  Dropdown,
  Grid,
  NumberInput,
  Row,
  Search,
} from '@bahmni/design-system';
import React from 'react';
import { Drug } from '../types';

type PrescriptionDialogProps = {
  drug: Drug;
  onClose: Function;
};

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
};
const PrescriptionDialog = (props: PrescriptionDialogProps) => {
  const dosageUnits: string[] = ['Tablet', 'Injection'];
  const durationUnits: string[] = ['Days', 'Weeks', 'Months'];
  const drugRoutes: string[] = ['Oral', 'Intravenous'];
  const currentDate: string = new Date().toLocaleDateString();
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
                      invalidText="Dosage cannot be less than 0"></NumberInput>
                  </Column>
                  <Column sm={3}>
                    <Dropdown
                      id="dosageUnit"
                      label="Dosage Unit"
                      titleText="Units"
                      items={dosageUnits}
                      ariaLabel="Dosage Unit"
                    />
                  </Column>
                </Row>
              </Column>
              <Column style={{ color: '#525252' }}>
                Frequency
                <br></br>
                <br></br>
                <Search size="lg" id="frequencySearch" labelText="Frequency Search"></Search>
              </Column>
              <Column>
                <Row>
                  <Column sm={1}>
                    <NumberInput
                      id="duration"
                      label="Duration"
                      hideSteppers={true}
                      min={0}
                      invalidText="Duration cannot be less than 0"></NumberInput>
                  </Column>
                  <Column sm={3}>
                    <Dropdown
                      id="durationUnit"
                      label="Duration Unit"
                      titleText="Units"
                      items={durationUnits}
                      ariaLabel="Duration Unit"
                    />
                  </Column>
                </Row>
              </Column>
            </Row>

            <Row>
              <Column>
                <DatePicker
                  datePickerType="single"
                  dateFormat="m/d/Y"
                  short={true}
                  value={currentDate}
                  minDate={currentDate}>
                  <DatePickerInput placeholder="dd/mm/yyyy" labelText="Start Date" id="startDate" />
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
                      invalidText="Quantity cannot be less than 0"></NumberInput>
                  </Column>
                  <Column sm={3}>
                    <Dropdown
                      id="quantityUnit"
                      label="Quantity Unit"
                      titleText="Units"
                      items={dosageUnits}
                      ariaLabel="Quantity Unit"
                    />
                  </Column>
                </Row>
              </Column>
              <Column>
                <Dropdown id="route" label="Route" titleText="Route" items={drugRoutes} />
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
  );
};

export default PrescriptionDialog;

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@bahmni/design-system';

const styles = {
  providerName: { fontSize: '0.7rem', float: 'right', paddingTop: '10px' } as React.CSSProperties,
  tableSubHeading: { textAlign: 'center' },
  tablePos: { position: 'fixed', bottom: '30px', alignItems: 'center' } as React.CSSProperties,
};

const headerData = [
  'Drug Information - Name, Form, Route',
  'Schedule - Dosage, Frequency, Duration',
  'Total quantity',
  'Instruction',
  'Status',
  'Action',
];

const schedule = (drugInfo) => {
  const doseInfo = drugInfo.dosingInstructions;
  const startDate = new Date(drugInfo.effectiveStartDate).toLocaleDateString();
  const schedule = `${doseInfo.dose} ${doseInfo.doseUnits}, ${doseInfo.frequency} for ${drugInfo.duration} ${drugInfo.durationUnits} started on ${startDate}`;
  return schedule;
};

let lastVisitDate;
const getSubHeading = (visitDate) => {
  if (lastVisitDate === null || lastVisitDate != visitDate) {
    lastVisitDate = visitDate;
    return (
      <TableRow>
        <TableCell colSpan={6} style={styles.tableSubHeading}>
          {new Date(visitDate).toLocaleDateString()}
        </TableCell>
      </TableRow>
    );
  }
};

const getAdditionalInstruction = (row) => {
  const instructionJson = JSON.parse(row.dosingInstructions.administrationInstructions);
  return instructionJson.additionalInstructions ? instructionJson.additionalInstructions : '';
};

const ActivePrescription = ({ activePrescriptionData }) => {
  return (
    <div style={styles.tablePos}>
      <Table>
        <TableHead>
          <TableRow>
            {headerData.map((header, i) => (
              <TableHeader key={i}>{header}</TableHeader>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {activePrescriptionData
            .slice()
            .reverse()
            .map((row, i) => (
              <>
                {getSubHeading(row.visit.startDateTime)}
                <TableRow>
                  <TableCell>
                    {row.concept.name}, {row.drug.form}, {row.dosingInstructions.route}
                  </TableCell>
                  <TableCell>
                    {schedule(row)}
                    <small style={styles.providerName}>by {row.provider.name}</small>
                  </TableCell>
                  <TableCell>
                    {row.dosingInstructions.quantity} {row.dosingInstructions.quantityUnits}
                  </TableCell>
                  <TableCell>{getAdditionalInstruction(row)}</TableCell>
                  <TableCell>active</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ActivePrescription;

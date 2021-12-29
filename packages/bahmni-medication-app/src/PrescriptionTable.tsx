import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Link } from '@bahmni/design-system';
import React from 'react';
import { headerData } from './constants';

const styles = {
  providerName: { fontSize: '0.7rem', float: 'right', paddingTop: '10px' } as React.CSSProperties,
  tableSubHeading: { textAlign: 'center' },
};

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

const getStatus = (row) => {
  if (!row.dateStopped) return 'active';
};

const PrescriptionTable = ({ data }) => {
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
        {data
          .slice()
          .reverse()
          .map((row) => (
            <React.Fragment key={Math.random()}>
              {getSubHeading(row.visit.startDateTime)}
              <TableRow>
                <TableCell>
                  {row.drug.name}, {row.drug.form}, {row.dosingInstructions.route}
                </TableCell>
                <TableCell>
                  {schedule(row)}
                  <small style={styles.providerName}>by {row.provider.name}</small>
                </TableCell>
                <TableCell>
                  {row.dosingInstructions.quantity} {row.dosingInstructions.quantityUnits}
                </TableCell>
                <TableCell>{getAdditionalInstruction(row)}</TableCell>
                <TableCell>{getStatus(row)}</TableCell>
                <TableCell>
                  <Link inline>revise</Link> <Link inline>stop</Link> <Link inline>renew</Link>{' '}
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
      </TableBody>
    </Table>
  );
};

export default PrescriptionTable;
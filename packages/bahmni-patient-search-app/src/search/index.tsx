/* eslint-disable no-console */

import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
// import Button from 'carbon-components-react/es/components/Button';
import { Button } from '@bahmni/design-system/src';
import TextInput from 'carbon-components-react/es/components/TextInput';
import { Tile } from 'carbon-components-react/es/components/Tile';
import { getPatient } from './api';
import {
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  DataTableRow,
} from 'carbon-components-react';
import { ExtensionSlot, useConfig } from '@openmrs/esm-framework';
import { Config } from '../config-schema';
import styles from './styles.css';

const headers = [
  {
    key: 'patientId',
    header: 'ID',
  },
  {
    key: 'givenName',
    header: 'Given Name',
  },
  {
    key: 'familyName',
    header: 'Family Name',
  },
  {
    key: 'gender',
    header: 'Gender',
  },
  {
    key: 'birthDate',
    header: 'BirthDate',
  },
];

const Search: React.FC = () => {
  const { t } = useTranslation();
  const config = useConfig() as Config;
  const [patients, setPatients] = useState<Array<fhir.Patient>>();
  const [patientName, setPatientName] = useState('test');

  function renderPatients() {
    const patientRows: DataTableRow<string>[] = patients.map((r) => {
      return {
        id: r.identifier[0].id,
        patientId: r.identifier[0].value,
        givenName: r.name[0].given,
        familyName: r.name[0].family,
        gender: r.gender.toUpperCase(),
        birthDate: r.birthDate,
      };
    });

    return (
      <DataTable rows={patientRows} headers={headers}>
        {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
          <Table {...getTableProps()}>
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableHeader {...getHeaderProps({ header })}>{header.header}</TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow {...getRowProps({ row })}>
                  {row.cells.map((cell) => (
                    <TableCell key={cell.id}>{cell.value}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DataTable>
    );
  }

  //Translation doesnt seems to work with hook or Trans component - need to look
  function renderTitle() {
    return (
      <div className={styles.title}>
        {config.searchTitle ? (
          t('shortTitle')
        ) : (
          <Trans i18nKey="longTitle">Search Patients - Returns top 10 records</Trans>
        )}{' '}
      </div>
    );
  }

  return (
    <div className={`omrs-main-content ${styles.container}`}>
      {renderTitle()}
      <TextInput
        id="search-patient-input"
        defaultValue="test"
        labelText="Enter Patient Name"
        onChange={(e) => setPatientName(e.target.value)}
        style={{ width: '50%' }}
      />
      <Button onClick={() => getPatient(patientName).then(setPatients)} style={{ margin: '30px 0px' }}>
        <Trans key="getPatient">Search patients with nome </Trans> "{patientName}"
      </Button>
      <Tile>{patients ? renderPatients() : null}</Tile>
      <ExtensionSlot extensionSlotName="search-patient-widgets-slot" />
    </div>
  );
};

export default Search;

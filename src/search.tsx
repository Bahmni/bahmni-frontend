import React from 'react';
import styles from './search-styles.css';
import { PatientSearch } from './patient-search';

const Search: React.FC = () => {
  return (
    <div className={`omrs-main-content ${styles.container}`}>
      <PatientSearch />
    </div>
  );
};

export default Search;

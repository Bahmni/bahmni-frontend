import React from 'react';

const styles = {
  dialog_container: {
    border: '2px solid #f4f4f4',
  },
};
const PrescriptionDialog = (props: { drug: any; onClose }) => {
  return (
    <div style={styles.dialog_container} title="prescriptionDialog">
      <p>{props.drug.name}</p>
    </div>
  );
};

export default PrescriptionDialog;

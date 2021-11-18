import Button from 'carbon-components-react/lib/components/Button';
import Modal from 'carbon-components-react/lib/components/Modal';
import Select from 'carbon-components-react/lib/components/Select';
import SelectItem from 'carbon-components-react/lib/components/SelectItem';
import TextInput from 'carbon-components-react/lib/components/TextInput';
import {
  ExpandableTile,
  TileAboveTheFoldContent,
  TileBelowTheFoldContent,
} from 'carbon-components-react/lib/components/Tile';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';

interface Props {}
const BahmniPatientFilterModal: React.FC<Props> = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      {typeof document === 'undefined'
        ? null
        : ReactDOM.createPortal(
            <Modal
              open={open}
              onRequestClose={() => setOpen(false)}
              modalHeading="Filter Patient Visits"
              modalLabel="Patient Filter"
              primaryButtonText="Save"
              secondaryButtonText="Cancel">
              <p style={{ marginBottom: '1rem' }}>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Reprehenderit consequatur nihil, sed saepe in
                amet maxime vero, iste illum nemo eos iure aliquid? Illo, cupiditate alias facilis recusandae aspernatur
                odio.
              </p>

              <TextInput
                data-modal-primary-focus
                id="text-input-1"
                labelText="Patient Name"
                placeholder="e.g. Nemo"
                style={{ marginBottom: '1rem' }}
              />

              <Select id="select-1" defaultValue="us-south" labelText="Location">
                <SelectItem value="us-south" text="Pune" />
                <SelectItem value="us-east" text="Goa" />
                <SelectItem value="us-east" text="Shirur" />
                <SelectItem value="us-east" text="Nirvana" />
              </Select>
            </Modal>,
            document.body,
          )}
      <div style={{ marginLeft: '10px', marginBottom: '20px' }}>
        <h4>Bahmni Patient Filter Widget</h4>
        <ExpandableTile>
          <TileAboveTheFoldContent>
            <div style={{ height: '50px' }}>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Reprehenderit consequatur nihil, sed saepe in
              amet maxime vero, iste illum nemo eos iure aliquid? Illo, cupiditate alias facilis recusandae aspernatur
              odio.
            </div>
          </TileAboveTheFoldContent>

          <TileBelowTheFoldContent>
            <div style={{ height: '100px' }}>
              <Button kind="primary" onClick={() => setOpen(true)}>
                Filter Patients
              </Button>
            </div>
          </TileBelowTheFoldContent>
        </ExpandableTile>
      </div>
    </>
  );
};
export default BahmniPatientFilterModal;

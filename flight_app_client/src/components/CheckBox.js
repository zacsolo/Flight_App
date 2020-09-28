import React, { useState } from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

export default function CheckboxLabels({ anytimeCheckbox, OneWayCheckBox }) {
  const [anytime, setAnytime] = useState(false);
  const [oneWay, setOneWay] = useState(false);

  const handleAnytime = (e) => {
    anytimeCheckbox(!anytime);
    setAnytime(!anytime);
  };
  const handleOneWay = (e) => {
    OneWayCheckBox(!oneWay);
    setOneWay(!oneWay);
  };

  return (
    <FormGroup row>
      <FormControlLabel
        control={
          <Checkbox
            checked={anytime}
            onChange={handleAnytime}
            name='anytime'
            color='primary'
          />
        }
        label='try anytime!'
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={oneWay}
            onChange={handleOneWay}
            name='one-way'
            color='primary'
          />
        }
        label='one-way'
      />
    </FormGroup>
  );
}

import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

export default function CheckboxLabels({ anytimeCheckbox }) {
  const [state, setState] = React.useState({
    anytime: false,
  });

  const handleChange = (event) => {
    anytimeCheckbox(event.target.checked);
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  return (
    <FormGroup row>
      <FormControlLabel
        control={
          <Checkbox
            checked={state.anytime}
            onChange={handleChange}
            name='anytime'
            color='primary'
          />
        }
        label='try anytime!'
      />
    </FormGroup>
  );
}

import React, { useState } from 'react';

import QueryInput from '../components/QueryInput';
import BasicDatePicker from '../components/DatePicker';
import Button from '@material-ui/core/Button';
import CheckBox from '../components/CheckBox';
import { FormControl } from '@material-ui/core';

export default function FlightForm({ error, searchForFlights }) {
  const [value, setValue] = useState({
    startingAirport: '',
    endingAirport: '',
    outboundDate: '',
    inboundDate: '',
  });
  const [disableDates, setDisableDates] = useState(false);

  if (error) {
    console.log('ERROR', error.graphQLErrors[0].extensions.errors);
  }

  const updateState = (inputPlace, name) => {
    const newPlace = inputPlace[0].placeId;
    setValue({ ...value, [name]: newPlace });
  };
  const updateDate = (inputDate, name) => {
    setValue({ ...value, [name]: inputDate });
  };

  const anytimeCheckbox = (params) => {
    console.log(params);
    setDisableDates(!disableDates);
    params
      ? setValue({ ...value, outboundDate: 'anytime', inboundDate: 'anytime' })
      : setValue({ ...value, outboundDate: '', inboundDate: '' });
  };

  const handleSubmit = () => {
    console.log(value);
    searchForFlights(value);
  };

  return (
    <FormControl>
      <QueryInput name='startingAirport' updateState={updateState} />
      <QueryInput name='endingAirport' updateState={updateState} />
      <BasicDatePicker
        name='outboundDate'
        updateDate={updateDate}
        disableDates={disableDates}
      />
      <BasicDatePicker
        name='inboundDate'
        updateDate={updateDate}
        disableDates={disableDates}
      />
      <CheckBox anytimeCheckbox={anytimeCheckbox} />
      <Button onClick={handleSubmit} variant='outlined' color='secondary'>
        Let's Go!
      </Button>
    </FormControl>
  );
}

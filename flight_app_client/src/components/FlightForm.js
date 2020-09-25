import React, { useState } from 'react';

import QueryInput from '../components/QueryInput';
import BasicDatePicker from '../components/DatePicker';
import Button from '@material-ui/core/Button';
import CheckBox from '../components/CheckBox';
import { FormControl } from '@material-ui/core';

export default function FlightForm({ error, searchForFlights }) {
  const [value, setValue] = useState({
    from: '',
    to: '',
    departureDate: '',
    returnDate: '',
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

  const anytimeDates = (params) => {
    console.log(params);
    setDisableDates(!disableDates);
    params
      ? setValue({ ...value, departureDate: 'anytime', returnDate: 'anytime' })
      : setValue({ ...value, departureDate: '', returnDate: '' });
  };

  const handleSubmit = () => {
    console.log(value);
    searchForFlights({
      startingAirport: value.from,
      endingAirport: value.to,
      outboundDate: value.departureDate,
      inboundDate: value.returnDate,
    });
  };

  return (
    <FormControl>
      <QueryInput name='from' updateState={updateState} />
      <QueryInput name='to' updateState={updateState} />
      <BasicDatePicker
        name='departureDate'
        updateDate={updateDate}
        disableDates={disableDates}
      />
      <BasicDatePicker
        name='returnDate'
        updateDate={updateDate}
        disableDates={disableDates}
      />
      <CheckBox anytimeDates={anytimeDates} />
      <Button onClick={handleSubmit} variant='outlined' color='secondary'>
        Let's Go!
      </Button>
    </FormControl>
  );
}

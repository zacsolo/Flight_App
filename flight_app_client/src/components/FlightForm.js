import React, { useState } from 'react';
import QueryInput from '../components/QueryInput';
import BasicDatePicker from './BasicDatePicker';
import Button from '@material-ui/core/Button';
import CheckBox from '../components/CheckBox';

import { Checkbox, FormControl } from '@material-ui/core';

export default function FlightForm({
  error,
  searchForFlights,
  noDestinationPicker,
}) {
  const [value, setValue] = useState({
    startingAirport: '',
    endingAirport: '',
    outboundDate: '',
    inboundDate: '',
    oneWay: false,
  });

  const [disableDates, setDisableDates] = useState(false);

  if (error) {
    // console.log('ERROR', error.graphQLErrors[0].extensions.errors);
    console.log('ERROR', error);
  }

  const updateState = (inputPlace, name) => {
    const newPlace = inputPlace[0].placeId;
    setValue({ ...value, [name]: newPlace });
  };
  const updateDate = (inputDate, name) => {
    setValue({ ...value, [name]: inputDate });
  };

  const anytimeCheckbox = (checked) => {
    console.log('SENT FROM CHECKBOX', checked);
    setDisableDates(!disableDates);
    checked
      ? setValue({ ...value, outboundDate: 'anytime', inboundDate: 'anytime' })
      : setValue({ ...value, outboundDate: '', inboundDate: '' });
  };

  const handleOneWayCheckBox = (checked) => {
    console.log('SENT FROM CHECKBOX', checked);
    checked
      ? setValue({ ...value, oneWay: true })
      : setValue({ ...value, oneWay: false });
  };

  const handleSubmit = () => {
    console.log(value);

    searchForFlights(value);
  };

  return (
    <>
      {noDestinationPicker ? (
        <FormControl style={{ marginBottom: 25 }}>
          <QueryInput name='startingAirport' updateState={updateState} />
          <QueryInput
            name='endingAirport'
            updateState={updateState}
            toAnywhere={true}
          />
          <BasicDatePicker
            name='outboundDate'
            updateDate={updateDate}
            disableDates={disableDates}
          />
          {!value.oneWay && (
            <BasicDatePicker
              name='inboundDate'
              updateDate={updateDate}
              disableDates={disableDates}
            />
          )}
          <CheckBox
            anytimeCheckbox={anytimeCheckbox}
            OneWayCheckBox={handleOneWayCheckBox}
          />
          <Button onClick={handleSubmit} variant='outlined' color='secondary'>
            Let's Go!
          </Button>
        </FormControl>
      ) : (
        <FormControl style={{ marginBottom: 25 }}>
          <QueryInput name='startingAirport' updateState={updateState} />
          <QueryInput name='endingAirport' updateState={updateState} />
          <BasicDatePicker
            name='outboundDate'
            updateDate={updateDate}
            disableDates={disableDates}
          />
          {!value.oneWay && (
            <BasicDatePicker
              name='inboundDate'
              updateDate={updateDate}
              disableDates={disableDates}
            />
          )}
          <CheckBox
            anytimeCheckbox={anytimeCheckbox}
            OneWayCheckBox={handleOneWayCheckBox}
          />
          <Button onClick={handleSubmit} variant='outlined' color='secondary'>
            Let's Go!
          </Button>
        </FormControl>
      )}
    </>
  );
}

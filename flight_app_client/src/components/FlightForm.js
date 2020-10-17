import React, { useState, useContext } from 'react';
import { GlobalSearchStateContext } from '../utils/context';

import BasicDatePicker from './BasicDatePicker';
import CheckBox from '../components/CheckBox';
import { validateFlight } from '../utils/validFlight';
import { useStyles } from './styles/StyledFlightForm';
//
import { FormControl, Paper, Button } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import PlaceAutocomplete from './PlaceAutocomplete.js';

//
export default function FlightForm({ searchForFlights, toggleOpen }) {
  //-Context
  const { searchDrawerOpen, adventureMode } = useContext(
    GlobalSearchStateContext
  );
  //
  //-Styles
  const classes = useStyles(searchDrawerOpen);
  //
  //-Local State
  const [value, setValue] = useState({
    startingAirport: '',
    endingAirport: '',
    outboundDate: '',
    inboundDate: '',
    oneWay: false,
  });
  const [disableDates, setDisableDates] = useState(false);
  const [errors, setErrors] = useState([]);
  //
  //-Event Handlers
  const updateState = (inputData, name) => {
    // const newPlace = inputData[0].placeId;
    const newPlace = inputData.placeId;
    setValue({
      ...value,
      [name]: name.includes('Date') ? inputData : newPlace,
    });
  };

  const handleAnytimeCheckbox = (checked) => {
    const { oneWay, inboundDate } = value;
    setDisableDates(!disableDates);
    setValue({
      ...value,
      outboundDate: checked ? 'anytime' : '',
      inboundDate: oneWay ? inboundDate : checked ? 'anytime' : '',
    });
  };

  const handleOneWayCheckBox = (checked) => {
    setValue({
      ...value,
      oneWay: checked,
      inboundDate: checked ? '' : 'anytime',
      outboundDate: 'anytime',
    });
  };

  const handleSubmit = () => {
    const { errors, valid } = validateFlight(adventureMode, { ...value });
    if (valid) {
      searchForFlights(value);
      toggleOpen && toggleOpen();
    } else {
      setErrors(errors);
    }
  };
  //
  //-Render
  return (
    <div className={classes.formWrapper}>
      <Paper
        elevation={searchDrawerOpen ? 0 : 3}
        className={classes.formDisplay}>
        <FormControl className={classes.formContainer}>
          <PlaceAutocomplete
            name='startingAirport'
            updateFormState={updateState}
            error={errors.startingAirport}
          />
          <PlaceAutocomplete
            name='endingAirport'
            updateFormState={updateState}
            toAnywhere={adventureMode ? true : false}
            error={errors.endingAirport}
          />
          <BasicDatePicker
            name='outboundDate'
            updateDate={updateState}
            disableDates={disableDates}
            error={errors.outboundDate}
          />
          <BasicDatePicker
            name='inboundDate'
            updateDate={updateState}
            disableForOneWay={value.oneWay}
            disableDates={disableDates}
            error={errors.inboundDate}
          />
          <div className={classes.checkboxWrapper}>
            <CheckBox
              anytimeCheckbox={handleAnytimeCheckbox}
              OneWayCheckBox={handleOneWayCheckBox}
            />
          </div>
        </FormControl>
      </Paper>
      <Button
        startIcon={<SearchIcon />}
        onClick={handleSubmit}
        variant='contained'
        color={adventureMode ? 'secondary' : 'primary'}
        size={searchDrawerOpen ? 'large' : 'medium'}
        className={classes.formSearchButton}>
        Let's Go!
      </Button>
    </div>
  );
}

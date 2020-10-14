import React, { useState } from 'react';
import QueryInput from '../components/QueryInput';
import BasicDatePicker from './BasicDatePicker';
import Button from '@material-ui/core/Button';
import CheckBox from '../components/CheckBox';
import { makeStyles } from '@material-ui/core';
import { validateFlightAnywhere } from '../utils/validFlight';
import { validateFlightWithDest } from '../utils/validFlight';
import { FormControl, Paper } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles({
  formWrapper: {
    textAlign: (drawer) => drawer && 'center',
    marginTop: (drawer) => drawer && '16px',
  },
  formDisplay: {
    maxWidth: (drawer) => (drawer ? '100%' : '70%'),
    minWidth: (drawer) => (drawer ? '100%' : '370px'),
    margin: '0 auto',
    paddingTop: 5,
    borderRadius: 15,
  },
  formContainer: {
    marginBottom: (drawer) => !drawer && '25px',
  },
  checkboxWrapper: { margin: '0 auto' },
  formSearchButton: {
    marginTop: (drawer) => (drawer ? 20 : -20),
    borderRadius: 20,
    marginBottom: (drawer) => (drawer ? 20 : 0),
  },
});

export default function FlightForm({
  searchForFlights,
  noDestinationPicker,
  toggleOpen,
  drawer,
}) {
  let drawerOpen = drawer ? true : false;
  const classes = useStyles(drawerOpen);
  //
  //State_____________
  const [value, setValue] = useState({
    startingAirport: '',
    endingAirport: '',
    outboundDate: '',
    inboundDate: '',
    oneWay: false,
  });
  const [disableDates, setDisableDates] = useState(false);
  const [errors, setErrors] = useState([]);
  //_______________

  //---CAN PROBABLY REFACTOR---
  //---These two together---
  const updateState = (inputPlace, name) => {
    const newPlace = inputPlace[0].placeId;
    setValue({ ...value, [name]: newPlace });
  };
  const updateDate = (inputDate, name) => {
    setValue({ ...value, [name]: inputDate });
  };
  //

  const anytimeCheckbox = (checked) => {
    if (value.oneWay) {
      setDisableDates(!disableDates);
      checked
        ? setValue({
            ...value,
            outboundDate: 'anytime',
            inboundDate: '',
          })
        : setValue({ ...value, outboundDate: '', inboundDate: '' });
    } else if (!value.oneWay) {
      setDisableDates(!disableDates);
      checked
        ? setValue({
            ...value,
            outboundDate: 'anytime',
            inboundDate: 'anytime',
          })
        : setValue({ ...value, outboundDate: '', inboundDate: '' });
    }
  };

  const handleOneWayCheckBox = (checked) => {
    console.log('DATES DISABLED', disableDates);
    console.log('checked', checked);
    if (disableDates) {
      if (checked) {
        setValue({
          ...value,
          oneWay: checked,
          inboundDate: '',
          outboundDate: 'anytime',
        });
      } else {
        setValue({
          ...value,
          oneWay: checked,
          inboundDate: 'anytime',
          outboundDate: 'anytime',
        });
      }
    } else {
      setValue({
        ...value,
        oneWay: checked,
      });
    }
  };

  const handleSubmit = () => {
    //FOR ANYWHERE FLIGHT
    if (noDestinationPicker) {
      const { errors, valid } = validateFlightAnywhere(
        value.startingAirport,
        value.outboundDate,
        value.inboundDate,
        value.oneWay
      );
      if (valid) {
        searchForFlights(value);
        if (toggleOpen) {
          toggleOpen();
        }
      } else {
        setErrors(errors);
        return;
      }
    }
    //FOR FLIGHT WITH A CHOSEN DESTINATION
    else {
      const { errors, valid } = validateFlightWithDest(
        value.startingAirport,
        value.endingAirport,
        value.outboundDate,
        value.inboundDate,
        value.oneWay
      );
      if (valid) {
        searchForFlights(value);
        if (toggleOpen) {
          toggleOpen();
        }
      } else {
        console.log(errors);
        setErrors(errors);
        return;
      }
    }

    searchForFlights(value);
  };

  return (
    <div className={classes.formWrapper}>
      <Paper elevation={drawer ? 0 : 3} className={classes.formDisplay}>
        <FormControl className={classes.formContainer}>
          <QueryInput
            name='startingAirport'
            updateState={updateState}
            error={errors.starting}
          />
          <QueryInput
            name='endingAirport'
            updateState={updateState}
            toAnywhere={noDestinationPicker ? true : false}
            error={errors.ending}
          />
          <BasicDatePicker
            name='outboundDate'
            updateDate={updateDate}
            disableDates={disableDates}
            error={errors.outbound}
          />
          <BasicDatePicker
            name='inboundDate'
            updateDate={updateDate}
            disableForOneWay={value.oneWay}
            disableDates={disableDates}
            error={errors.inbound}
          />
          <div className={classes.checkboxWrapper}>
            <CheckBox
              anytimeCheckbox={anytimeCheckbox}
              OneWayCheckBox={handleOneWayCheckBox}
              error={errors.ending}
            />
          </div>
        </FormControl>
      </Paper>
      <Button
        startIcon={<SearchIcon />}
        onClick={handleSubmit}
        variant='contained'
        color={noDestinationPicker ? 'secondary' : 'primary'}
        size={drawer ? 'large' : 'medium'}
        className={classes.formSearchButton}>
        Let's Go!
      </Button>
    </div>
  );
}

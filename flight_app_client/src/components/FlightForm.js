import React, { useState } from 'react';
import QueryInput from '../components/QueryInput';
import BasicDatePicker from './BasicDatePicker';
import Button from '@material-ui/core/Button';
import CheckBox from '../components/CheckBox';
import { validateFlightAnywhere } from '../utils/validFlight';
import { validateFlightWithDest } from '../utils/validFlight';

import { FormControl, Paper } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

export default function FlightForm({
  searchForFlights,
  noDestinationPicker,
  toggleOpen,
}) {
  const [value, setValue] = useState({
    startingAirport: '',
    endingAirport: '',
    outboundDate: '',
    inboundDate: '',
    oneWay: false,
  });

  const [disableDates, setDisableDates] = useState(false);
  const [errors, setErrors] = useState([]);

  // if (error) {
  //   console.log('ERROR', error.graphQLErrors[0].extensions.errors);
  // }

  const updateState = (inputPlace, name) => {
    const newPlace = inputPlace[0].placeId;
    setValue({ ...value, [name]: newPlace });
  };
  const updateDate = (inputDate, name) => {
    setValue({ ...value, [name]: inputDate });
  };

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
      console.log('SET STATE', value);
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

    console.log('STATE BEING SEARCHED FOR', value);

    searchForFlights(value);
  };

  return (
    <>
      {errors.length < 1 ? (
        noDestinationPicker ? (
          <>
            <Paper
              elevation={3}
              style={{
                maxWidth: '70%',
                minWidth: 370,
                margin: '0 auto',
                paddingTop: 5,
                borderRadius: 15,
              }}>
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
                <BasicDatePicker
                  name='inboundDate'
                  updateDate={updateDate}
                  disableForOneWay={value.oneWay}
                  disableDates={disableDates}
                />
                <div style={{ margin: '0 auto' }}>
                  <CheckBox
                    anytimeCheckbox={anytimeCheckbox}
                    OneWayCheckBox={handleOneWayCheckBox}
                  />
                </div>
              </FormControl>
            </Paper>
            <Button
              startIcon={<SearchIcon />}
              onClick={handleSubmit}
              variant='contained'
              color='secondary'
              style={{
                marginTop: -20,
                borderRadius: 20,
              }}>
              Let's Go!
            </Button>
          </>
        ) : (
          <>
            <Paper
              elevation={3}
              style={{
                maxWidth: '70%',
                minWidth: 370,
                margin: '0 auto',
                paddingTop: 5,
                borderRadius: 15,
              }}>
              <FormControl style={{ marginBottom: 25 }}>
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
                  disableForOneWay={value.oneWay}
                  disableDates={disableDates}
                />
                <div style={{ margin: '0 auto' }}>
                  <CheckBox
                    anytimeCheckbox={anytimeCheckbox}
                    OneWayCheckBox={handleOneWayCheckBox}
                  />
                </div>
              </FormControl>
            </Paper>
            <Button
              startIcon={<SearchIcon />}
              onClick={handleSubmit}
              variant='contained'
              color='primary'
              style={{
                marginTop: -20,
                borderRadius: 20,
              }}>
              Let's Go!
            </Button>
          </>
        )
      ) : // ERRORS FORM BELOW
      noDestinationPicker ? (
        <>
          <Paper
            elevation={3}
            style={{
              maxWidth: '70%',
              minWidth: 370,
              margin: '0 auto',
              paddingTop: 5,
              borderRadius: 15,
            }}>
            <FormControl style={{ marginBottom: 25 }}>
              <QueryInput
                name='startingAirport'
                updateState={updateState}
                error={errors.starting}
              />
              <QueryInput
                name='endingAirport'
                updateState={updateState}
                toAnywhere={true}
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
              <div style={{ margin: '0 auto' }}>
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
            color='secondary'
            style={{
              marginTop: -20,
              borderRadius: 20,
            }}>
            Let's Go!
          </Button>
        </>
      ) : (
        <>
          <Paper
            elevation={3}
            style={{
              maxWidth: '70%',
              minWidth: 370,
              margin: '0 auto',
              paddingTop: 5,
              borderRadius: 15,
            }}>
            <FormControl style={{ marginBottom: 25 }}>
              <QueryInput
                name='startingAirport'
                updateState={updateState}
                error={errors.starting}
              />
              <QueryInput
                name='endingAirport'
                updateState={updateState}
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
              <div style={{ margin: '0 auto' }}>
                <CheckBox
                  anytimeCheckbox={anytimeCheckbox}
                  OneWayCheckBox={handleOneWayCheckBox}
                />
              </div>
            </FormControl>
          </Paper>
          <Button
            startIcon={<SearchIcon />}
            onClick={handleSubmit}
            variant='contained'
            color='primary'
            style={{
              marginTop: -20,
              borderRadius: 20,
            }}>
            Let's Go!
          </Button>
        </>
      )}
    </>
  );
}

import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import useDebounced from '../hooks/useDebounced';
import { gql, useLazyQuery } from '@apollo/client';

export default function QueryInput() {
  const [findAirport, { loading, data, error }] = useLazyQuery(GET_AIRPORTS);

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState([]);
  const loading1 = open && options.length === 0;

  let debouncedState = useDebounced(searchTerm);
  console.log(debouncedState);
  console.log(loading);

  useEffect(() => {
    let active = true;

    if (loading) {
      if (debouncedState.length === 0) {
        console.log('loadin1 no value-->');
        setOpen(false);
      } else {
        console.log('loadin1 some value-->');
        return undefined;
      }
    }

    findAirport({ variables: { airportSearch: debouncedState } });
    console.log('body1 -->');
    if (active && data) {
      console.log('active and data -->');
      setOpen(true);
      setOptions(data.findAirport);
    }
    console.log('body2 -->');

    return () => {
      console.log('return -->');
      active = false;
    };
  }, [loading1, data, findAirport, debouncedState]);

  //--USE EFFECT FOR OPENING AND CLOSING INPUT
  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  //---JSX RENDER INPUT
  return (
    <div>
      <Autocomplete
        id='find-airport'
        style={{ width: 300 }}
        open={options.length > 1 && open}
        onOpen={() => {
          if (searchTerm.length > 1) {
            setOpen(true);
          }
        }}
        onClose={() => {
          setOpen(false);
        }}
        inputValue={searchTerm}
        onInputChange={(e, option) => {
          return setSearchTerm(option);
        }}
        getOptionSelected={(option, value) => {
          // console.log('OPTION', option);
          // console.log('VALUE', value);
          return option.placeName === value.placeName;
        }}
        getOptionLabel={(option) => {
          // console.log('option', option);
          // console.log('second', second);
          if (!option.regionId || option.regionId.trim() === '') {
            return `${option.placeName}, ${option.countryName}`;
          } else {
            return `${option.placeName}, ${option.regionId}`;
          }
        }}
        options={options.length > 1 ? options : []}
        loading={loading}
        renderInput={(params) => {
          return (
            <TextField
              {...params}
              label='From where?'
              variant='outlined'
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading ? (
                      <CircularProgress color='inherit' size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          );
        }}
      />
      {loading && <div style={{ marginTop: '500px' }}>Loading new Data</div>}
    </div>
  );
}

const GET_AIRPORTS = gql`
  query findAirport($airportSearch: String!) {
    findAirport(airportSearch: $airportSearch) {
      placeId
      placeName
      regionId
      countryName
    }
  }
`;

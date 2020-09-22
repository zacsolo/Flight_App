import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { gql, useLazyQuery } from '@apollo/client';

export default function QueryInput() {
  const [findAirport, { loading, data, error }] = useLazyQuery(GET_AIRPORTS);

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState([]);
  const loading1 = open && options.length === 0;

  console.log('INFINITE LOOP CHECKER');

  useEffect(() => {
    let active = true;

    if (!loading1) {
      return undefined;
    }
    if (searchTerm.trim() === '') {
      setOpen(false);
    }
    findAirport({ variables: { airportSearch: searchTerm } });
    if (active && data) {
      setOptions(data.findAirport);
    }

    return () => {
      active = false;
    };
  }, [loading1, data, findAirport, searchTerm]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);
  console.log(searchTerm);
  return (
    <Autocomplete
      id='find-airport'
      style={{ width: 300 }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      inputValue={searchTerm}
      onInputChange={(e, option) => {
        if (e) {
          return setSearchTerm(e.target.value);
        } else {
          return setSearchTerm(option);
        }
      }}
      getOptionSelected={(option, value) => {
        // console.log('OPTION', option);
        // console.log('VALUE', value);
        return option.placeName === value.placeName;
      }}
      getOptionLabel={(option) => {
        if (!option.regionId || option.regionId.trim() == '') {
          return `${option.placeName}, ${option.countryName}`;
        } else {
          return `${option.placeName}, ${option.regionId}`;
        }
      }}
      options={options}
      loading={loading1}
      renderInput={(params) => {
        console.log(params);
        return (
          <TextField
            {...params}
            label='Asynchronous'
            variant='outlined'
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading1 ? (
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

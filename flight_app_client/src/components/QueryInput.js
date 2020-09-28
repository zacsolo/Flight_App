import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import useDebounced from '../hooks/useDebounced';
import { gql, useLazyQuery } from '@apollo/client';

export default function QueryInput({ updateState, name, toAnywhere }) {
  //__GRAPH QL__
  //GraphQL query, sending the debounced search value as params
  const [findAirport, { loading, data }] = useLazyQuery(GET_AIRPORTS);
  //
  //__LOCAL STATE__
  //Is the drawer open
  const [open, setOpen] = useState(false);
  //A selection has been made from the options
  const [selected, setSelected] = useState('');
  //A term that is being searched for, passed to debounced
  const [searchTerm, setSearchTerm] = useState('');
  //The last search term that was fetched
  const [lastSearch, setLastSearch] = useState('');
  //The list of options populated
  const [options, setOptions] = useState([]);
  //The last list of options populated, used for matching
  const [oldOptions, setOldOptions] = useState([]);
  //Debounced seachTerms
  let debouncedState = useDebounced(searchTerm);

  //Helper Function Resets State
  const resetState = () => {
    setOpen(false);
    findAirport({ variables: { airportSearch: '' } });
    setSelected('');
    setOptions([]);
    setOldOptions([]);
  };

  useEffect(() => {
    let active = true;
    //--Checks for Resetting State--------------------------------
    if (searchTerm.length === 0 && searchTerm !== selected) {
      resetState();
    }
    if (searchTerm.length === 0 && searchTerm === selected) {
      resetState();
    }
    if (searchTerm !== lastSearch) {
      resetState();
    }
    //------------------------------------------------------------
    //
    //--Checks if the current search term matches an "old option"
    //--If so it sets that as the value of "selected"
    //
    //
    //--Selecting a Search Query and Passing to Parent for Search
    if (
      oldOptions.find(
        (name) => `${name.placeName}, ${name.countryName}` === searchTerm
      )
    ) {
      updateState(
        oldOptions.filter(
          (name) => `${name.placeName}, ${name.countryName}` === searchTerm
        ),
        name
      );
      setOpen(false);
      setSelected(searchTerm);
      return undefined;
    }
    //--Selecting a Search Query and Passing to Parent for Search
    if (
      oldOptions.find(
        (name) => `${name.placeName}, ${name.regionId}` === searchTerm
      )
    ) {
      updateState(
        oldOptions.filter(
          (name) => `${name.placeName}, ${name.regionId}` === searchTerm
        ),
        name
      );
      setOpen(false);
      setSelected(searchTerm);
      return undefined;
    }

    //This prevents an inifite loop, not sure why yet
    if (loading) {
      console.log(debouncedState);
      if (debouncedState.length === 0) {
        setOpen(false);
      } else {
        return undefined;
      }
    }
    //
    //--If there is currently data returned from GQL Query
    if (active && data) {
      //If nothing is selected but there is a search term
      if (selected.length < 1 && searchTerm.length >= 1) {
        //If this is a completely new search
        //Or a modification of the last active search
        if (lastSearch.length === 0 || lastSearch !== searchTerm) {
          setOpen(true);
          setLastSearch(searchTerm);
          setOptions(data.findAirport);
          setOldOptions(data.findAirport);
        }
        return undefined;
      }
      return undefined;
    }
    //If there is no selected query but there is a debounced search term
    if (selected.length < 1 && debouncedState.length > 0) {
      if (data) {
        return undefined;
      } else {
        //If there is no data returned from our GQL
        findAirport({ variables: { airportSearch: debouncedState } });
      }
    }

    return () => {
      active = false;
    };
  }, [data, findAirport, debouncedState]);

  //   --USE EFFECT FOR OPENING AND CLOSING INPUT
  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  //---JSX RENDER INPUT
  return (
    <Autocomplete
      disabled={toAnywhere}
      size='small'
      clearOnBlur={true}
      blurOnSelect={true}
      id={`find-airport-${name}`}
      style={{ width: 300 }}
      open={options.length > 1 && open}
      onOpen={() => {
        if (debouncedState.length > 1) {
          setOpen(true);
        }
      }}
      onClose={() => {
        setOpen(false);
      }}
      inputValue={searchTerm}
      onInputChange={(_, option) => setSearchTerm(option)}
      getOptionSelected={(option, value) => {
        return option.placeName === value.placeName;
      }}
      getOptionLabel={(option) => {
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
            label={
              toAnywhere
                ? 'To anywhere in the world!'
                : name === 'startingAirport'
                ? 'From where?'
                : 'To where?'
            }
            variant='standard'
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? (
                    <CircularProgress color='inherit' size={20} />
                  ) : null}
                  {/* {params.InputProps.endAdornment} */}
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

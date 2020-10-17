import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import usePlaceFetch from '../hooks/usePlaceFetch';
import useDebounced from '../hooks/useDebounced';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function PlaceAutocomplete({
  updateFormState,
  name,
  toAnywhere,
  error,
}) {
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState('');

  const debouncedValue = useDebounced(inputValue);
  const { loading, options: newOptions } = usePlaceFetch(debouncedValue, value);

  useEffect(() => {
    if (value) {
      if (inputValue.includes(value.placeName)) {
        console.log(value, name);
        updateFormState(value, name);
        return;
      }
    }

    setOptions(newOptions);
  }, [newOptions, debouncedValue]);

  const labelFormat = (option) => {
    if (!option.regionId || option.regionId.trim() === '') {
      return `${option.placeName}, ${option.countryName}`;
    } else {
      return `${option.placeName}, ${option.regionId}`;
    }
  };

  return (
    <Autocomplete
      onBlur={() => setOptions([])}
      blurOnSelect={true}
      noOptionsText='searching...'
      open={options.length >= 1}
      disabled={toAnywhere}
      value={value}
      onChange={(_, newValue) => {
        setValue(newValue);
      }}
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue);
      }}
      getOptionLabel={(option) => option && labelFormat(option)}
      getOptionSelected={(option, value) => {
        return option.placeName === value.placeName;
      }}
      id={`find-airport-${name}`}
      options={options}
      style={{ width: 300 }}
      renderInput={(params) => (
        <TextField
          {...params}
          error={error}
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
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}

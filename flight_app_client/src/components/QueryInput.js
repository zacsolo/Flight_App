// import React, { useState, useEffect } from 'react';
// import useDebounced from '../hooks/useDebounced';
// import { GET_AIRPORTS } from '../gql/PlaceQueries';
// import { useLazyQuery } from '@apollo/client';
// //
// //MUI
// import TextField from '@material-ui/core/TextField';
// import Autocomplete from '@material-ui/lab/Autocomplete';
// import CircularProgress from '@material-ui/core/CircularProgress';
// import useAutoComplete from '../hooks/usePlaceFetch';

// export default function QueryInput({
//   updateFormState,
//   name,
//   toAnywhere,
//   error,
// }) {
//   //
//   //__GRAPH QL__
//   //GraphQL query, sending the debounced search value as params
//   const [findAirport, { loading, data }] = useLazyQuery(GET_AIRPORTS);
//   //
//   //__LOCAL STATE__
//   const [value, setValue] = useState({
//     open: false,
//     selected: '',
//     searchTerm: '',
//     lastSearch: '',
//     options: [],
//     lastOptions: [],
//     test: {},
//   });

//   const {
//     open,
//     selected,
//     searchTerm,
//     lastSearch,
//     options,
//     lastOptions,
//   } = value;

//   let debouncedState = useDebounced(searchTerm);

//   //Helper Function Resets State
//   const resetState = () => {
//     setValue({
//       ...value,
//       open: false,
//       selected: '',
//       options: [],
//       lastOptions: [],
//     });
//     findAirport({ variables: { airportSearch: '' } });
//   };

//   const closeAfterSelection = () => {
//     setValue({ ...value, open: false, selected: searchTerm });
//   };

//   const findMatch = (arr) => {
//     return arr.find(
//       ({ placeName, regionId, countryName }) =>
//         `${placeName}, ${regionId || countryName}` === searchTerm
//     );
//   };

//   const filterSelection = (arr) => {
//     return arr.filter(
//       ({ placeName, regionId, countryName }) =>
//         `${placeName}, ${regionId || countryName}` === searchTerm
//     );
//   };

//   useEffect(() => {
//     if (searchTerm.length === 0) {
//       resetState();
//     }
//     if (searchTerm !== lastSearch) {
//       resetState();
//     }

//     if (findMatch(lastOptions)) {
//       updateFormState(filterSelection(lastOptions), name);
//       closeAfterSelection();
//       return undefined;
//     }

//     //This prevents an inifite loop, not sure why yet
//     if (loading) {
//       if (debouncedState.length === 0) {
//         console.log('IN DEBOUNDED STATE = 0 CLOSE DRAWER');
//         setValue({ ...value, open: false });
//       } else {
//         console.log(debouncedState);
//         return undefined;
//       }
//     }
//     //
//     //--If there is currently data returned from GQL Query
//     if (data) {
//       if (selected.length < 1 && searchTerm.length >= 1) {
//         if (lastSearch.length === 0 || lastSearch !== searchTerm) {
//           setValue({
//             ...value,
//             open: true,
//             lastSearch: searchTerm,
//             options: data.findAirport,
//             lastOptions: data.findAirport,
//           });
//         }
//         return undefined;
//       }

//       return undefined;
//     }

//     //If there is no selected query but there is a debounced search term
//     if (!data && selected.length < 1 && debouncedState.length > 0) {
//       findAirport({ variables: { airportSearch: debouncedState } });
//     }
//   }, [data, findAirport, debouncedState]);

//   //   --USE EFFECT FOR OPENING AND CLOSING INPUT
//   useEffect(() => {
//     if (!open) {
//       setValue({ ...value, options: [] });
//       // setOptions([]);
//     }
//   }, [open]);

//   //---JSX RENDER INPUT
//   return (
//     <Autocomplete
//       disabled={toAnywhere}
//       clearOnBlur={true}
//       blurOnSelect={true}
//       id={`find-airport-${name}`}
//       style={{ width: 300 }}
//       open={options.length > 1 && open}
//       onOpen={() => {
//         if (debouncedState.length > 1) {
//           setValue({ ...value, open: true });
//         }
//       }}
//       onClose={() => {
//         setValue({ ...value, open: false });
//       }}
//       inputValue={searchTerm}
//       onInputChange={(_, option) => {
//         setValue({ ...value, searchTerm: option });
//         console.log('Option from InputChange', option);
//       }}
//       getOptionSelected={(option, value) => {
//         console.log(option);
//         return option.placeName === value.placeName;
//       }}
//       getOptionLabel={(option) => {
//         if (!option.regionId || option.regionId.trim() === '') {
//           return `${option.placeName}, ${option.countryName}`;
//         } else {
//           return `${option.placeName}, ${option.regionId}`;
//         }
//       }}
//       options={options.length > 1 && options}
//       loading={loading}
//       renderInput={(params) => {
//         return (
//           <TextField
//             {...params}
//             label={
//               toAnywhere
//                 ? 'To anywhere in the world!'
//                 : name === 'startingAirport'
//                 ? 'From where?'
//                 : 'To where?'
//             }
//             error={error}
//             variant='standard'
//             InputProps={{
//               ...params.InputProps,
//               endAdornment: (
//                 <React.Fragment>
//                   {loading ? (
//                     <CircularProgress color='inherit' size={20} />
//                   ) : null}
//                 </React.Fragment>
//               ),
//             }}
//           />
//         );
//       }}
//     />
//   );
// }

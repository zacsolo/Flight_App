import React, { useState, useEffect } from 'react';
import { GET_AIRPORTS } from '../gql/PlaceQueries';
import { useLazyQuery } from '@apollo/client';

//This hook will take in a debounced search term
//Query our API using GraphQL
//And return a list of options

const usePlaceFetch = (debouncedSearchTerm, value) => {
  const [options, setOptions] = useState([]);
  const [findAirport, { loading }] = useLazyQuery(GET_AIRPORTS, {
    fetchPolicy: 'no-cache',
    onCompleted: (data) => setOptions(data.findAirport),
  });

  useEffect(() => {
    //Checks if there has been a change in search terms
    //since the last search, if nothing changed, no second search is made
    if (value && debouncedSearchTerm.includes(value.placeName)) {
      return;
    }
    if (loading) {
      return;
    }
    if (debouncedSearchTerm.length >= 1) {
      findAirport({ variables: { airportSearch: debouncedSearchTerm } });
    }
  }, [debouncedSearchTerm]);

  return { options, loading };
};

export default usePlaceFetch;

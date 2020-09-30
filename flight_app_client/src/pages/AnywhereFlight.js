import React, { useState, useEffect } from 'react';

import {
  GET_ONE_WAY_FLIGHT_ANYWHERE,
  GET_ROUND_TRIP_FLIGHT_ANYWHERE,
} from '../gql/FlightQueries';
import { useLazyQuery } from '@apollo/client';

import FlightForm from '../components/FlightForm';
import FlightDisplayCard from '../components/FlightDisplayCard';

export default function AnywhereFlight() {
  const [oneWayOptions, setOneWayOptions] = useState([]);

  const [roundTripOptions, setRoundTripOptions] = useState([]);

  const [oneWayToAnywhereQuery, { data, loading, error }] = useLazyQuery(
    GET_ONE_WAY_FLIGHT_ANYWHERE,
    {
      fetchPolicy: 'no-cache',
      onCompleted: (data) => setOneWayOptions(data.cheapestFlightsToAnywhere),
    }
  );
  const [
    roundTripToAnywhereQuery,
    { data: roundTripData, loading: roundTripLoading, error: roundTripError },
  ] = useLazyQuery(GET_ROUND_TRIP_FLIGHT_ANYWHERE, {
    fetchPolicy: 'no-cache',
    onCompleted: (data) => setRoundTripOptions(data.roundTripFlightToAnywhere),
  });

  //
  //
  //
  //------------------------------------------------------------------------
  //Need to make sure that there is only
  //ONE FORM OF DATA IN THIS COMPONENT AT A TIME
  //Rendering Data based on the last fetch, apollo client
  //caches the data, so there is no updating. Need to flush, or seperate out into different componets
  //1. Use local state to hold recently fetched data. Use
  //useEffect to delete old data when new data comes in (dont know how to do, yet)
  //2. Seperate a round trip and a one way into two different components
  //This may cause issues with the form, or rendering new forms (actually almost certainly will)

  //
  //
  //
  //------------------------------------------------------------------------

  const searchForFlights = (flightQuery) => {
    setOneWayOptions([]);
    setRoundTripOptions([]);
    if (flightQuery.inboundDate) {
      roundTripToAnywhereQuery({
        variables: {
          startingAirport: flightQuery.startingAirport,
          outboundDate: flightQuery.outboundDate,
          inboundDate: flightQuery.inboundDate,
        },
      });
    } else {
      oneWayToAnywhereQuery({
        variables: {
          startingAirport: flightQuery.startingAirport,
          searchDate: flightQuery.outboundDate,
          amountOfResults: 50,
        },
      });
    }
  };

  if (!loading) {
    console.log('ONE WAY DATA RETURNED', data);
  }
  if (!roundTripLoading) {
    console.log('ROUND TRIP DATA RETURNED', roundTripData);
  }

  return (
    <div className='App'>
      <FlightForm
        error={error}
        searchForFlights={searchForFlights}
        noDestinationPicker={true}
      />
      {data && !loading && (
        <div>
          {oneWayOptions.map((f) => (
            <FlightDisplayCard key={f.id} flight={{ ...f }} />
          ))}
          {error && console.log(error)}
        </div>
      )}
      {roundTripData && !roundTripLoading && (
        <div>
          {roundTripOptions.map((f) => (
            <FlightDisplayCard key={f.id} flight={{ ...f }} />
          ))}
          {roundTripError && console.log(roundTripError)}
        </div>
      )}
    </div>
  );
}

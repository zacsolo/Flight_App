import React, { useState, useEffect } from 'react';

import {
  GET_ONE_WAY_FLIGHT_ANYWHERE,
  GET_ROUND_TRIP_FLIGHT_ANYWHERE,
} from '../gql/FlightQueries';
import { useLazyQuery } from '@apollo/client';

import FlightForm from '../components/FlightForm';
import FlightDisplayCard from '../components/FlightDisplayCard';
import SearchDrawer from '../components/SearchDrawer';

export default function AnywhereFlight() {
  const [oneWayOptions, setOneWayOptions] = useState([]);
  const [initialSearch, setInitialSearch] = useState(true);
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

  const searchForFlights = (flightQuery) => {
    setInitialSearch(false);
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
      {initialSearch ? (
        <FlightForm
          error={error}
          searchForFlights={searchForFlights}
          noDestinationPicker={true}
        />
      ) : (
        <SearchDrawer>
          <FlightForm
            error={error}
            searchForFlights={searchForFlights}
            noDestinationPicker={true}
          />
        </SearchDrawer>
      )}

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

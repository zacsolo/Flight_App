import React from 'react';
import {
  GET_ONE_WAY_FLIGHT_ANYWHERE,
  GET_ROUND_TRIP_FLIGHT_ANYWHERE,
} from '../gql/FlightQueries';
import { useLazyQuery } from '@apollo/client';

import FlightForm from '../components/FlightForm';
import FlightDisplayCard from '../components/FlightDisplayCard';

export default function AnywhereFlight() {
  const [oneWayToAnywhereQuery, { data, loading, error }] = useLazyQuery(
    GET_ONE_WAY_FLIGHT_ANYWHERE
  );
  const [
    roundTripToAnywhereQuery,
    { data: roundTripData, loading: roundTripLoading, error: roundTripError },
  ] = useLazyQuery(GET_ROUND_TRIP_FLIGHT_ANYWHERE);

  const searchForFlights = (flightQuery) => {
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
    console.log('DATA RETURNED', data);
  }
  if (!roundTripLoading) {
    console.log('DATA RETURNED', roundTripData);
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
          {data.cheapestFlightsToAnywhere.map((f) => (
            <FlightDisplayCard key={f.id} flight={{ ...f }} />
          ))}
          {error && console.log(error)}
        </div>
      )}
      {roundTripData && !roundTripLoading && (
        <div>
          {roundTripData.roundTripFlightToAnywhere.map((f) => (
            <FlightDisplayCard key={f.id} flight={{ ...f }} />
          ))}
          {roundTripError && console.log(roundTripError)}
        </div>
      )}
    </div>
  );
}

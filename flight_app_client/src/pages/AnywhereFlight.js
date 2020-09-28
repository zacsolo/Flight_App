import React from 'react';
import { GET_FLIGHT_ANYWHERE } from '../gql/FlightQueries';
import { useLazyQuery } from '@apollo/client';

import moment from 'moment';

import FlightForm from '../components/FlightForm';
import FlightDisplayCard from '../components/FlightDisplayCard';

export default function AnywhereFlight() {
  const [getAnywhereFlights, { data, loading, error }] = useLazyQuery(
    GET_FLIGHT_ANYWHERE
  );

  const searchForFlights = (flightQuery) => {
    getAnywhereFlights({
      variables: {
        startingAirport: flightQuery.startingAirport,
        searchDate: flightQuery.outboundDate,
        amountOfResults: 50,
      },
    });
  };

  if (!loading) {
    console.log('DATA RETURNED', data);
  }

  return (
    <div className='App'>
      <h3>Explore Destinations</h3>
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
    </div>
  );
}

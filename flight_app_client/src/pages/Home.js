import React from 'react';
import { GET_CHEAP_FLIGHTS } from '../gql/FlightQueries';
import { useLazyQuery } from '@apollo/client';

import moment from 'moment';

import FlightForm from '../components/FlightForm';
import FlightDisplayCard from '../components/FlightDisplayCard';

export default function Home() {
  const [getFlights, { data, loading, error }] = useLazyQuery(
    GET_CHEAP_FLIGHTS
  );

  const searchForFlights = (flightQuery) => {
    console.log(flightQuery);
    getFlights({
      variables: {
        ...flightQuery,
      },
    });
  };
  console.log(data);
  return (
    <div className='App'>
      <FlightForm error={error} searchForFlights={searchForFlights} />
      {data && !loading && (
        <div>
          {data.getCheapestFlightsForQuery.map((f) => (
            <FlightDisplayCard id={f.id} flight={{ ...f }} />
          ))}
          {error && console.log(error)}
        </div>
      )}
    </div>
  );
}

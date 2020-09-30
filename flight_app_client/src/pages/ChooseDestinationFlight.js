import React, { useState } from 'react';
import { GET_CHEAP_FLIGHTS } from '../gql/FlightQueries';
import { useLazyQuery } from '@apollo/client';

import FlightForm from '../components/FlightForm';
import FlightDisplayCard from '../components/FlightDisplayCard';

export default function ChooseDestinationFlight() {
  const [oneWayOptions, setOneWayOptions] = useState([]);
  const [roundTripOptions, setRoundTripOptions] = useState([]);

  const [getFlights, { data, loading, error }] = useLazyQuery(
    GET_CHEAP_FLIGHTS
  );

  const searchForFlights = (flightQuery) => {
    console.log('QUERY', flightQuery);
    getFlights({
      variables: {
        ...flightQuery,
      },
    });
  };

  // const searchForFlights = (flightQuery) => {
  //   setOneWayOptions([]);
  //   setRoundTripOptions([]);
  //   if (flightQuery.inboundDate) {
  //     roundTripToAnywhereQuery({
  //       variables: {
  //         startingAirport: flightQuery.startingAirport,
  //         outboundDate: flightQuery.outboundDate,
  //         inboundDate: flightQuery.inboundDate,
  //       },
  //     });
  //   } else {
  //     oneWayToAnywhereQuery({
  //       variables: {
  //         startingAirport: flightQuery.startingAirport,
  //         searchDate: flightQuery.outboundDate,
  //         amountOfResults: 50,
  //       },
  //     });
  //   }
  // };

  return (
    <div className='App'>
      <FlightForm error={error} searchForFlights={searchForFlights} />

      {data && !loading && (
        <div>
          {data.getFlightsWithDestRoundTrip.map((f) => (
            <FlightDisplayCard key={f.id} flight={{ ...f }} />
          ))}
          {error && console.log(error)}
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import {
  GET_CHEAPEST_ROUNDTRIP_WITH_DEST,
  GET_CHEAPEST_ONE_WAY_WITH_DEST,
} from '../gql/FlightQueries';
import { useLazyQuery } from '@apollo/client';

import FlightForm from '../components/FlightForm';
import FlightDisplayCard from '../components/FlightDisplayCard';

export default function ChooseDestinationFlight() {
  const [oneWayOptions, setOneWayOptions] = useState([]);
  const [roundTripOptions, setRoundTripOptions] = useState([]);

  const [getRoundTripFlights, { data, loading, error }] = useLazyQuery(
    GET_CHEAPEST_ROUNDTRIP_WITH_DEST,
    {
      fetchPolicy: 'no-cache',
      onCompleted: (data) =>
        setRoundTripOptions(data.getFlightsWithDestRoundTrip),
    }
  );
  const [
    getOneWayFlights,
    { data: oneWayData, loading: oneWayLoading, error: oneWayError },
  ] = useLazyQuery(GET_CHEAPEST_ONE_WAY_WITH_DEST, {
    fetchPolicy: 'no-cache',
    onCompleted: (data) => setOneWayOptions(data.getFlightsWithDestOneWay),
  });

  // const searchForFlights = (flightQuery) => {
  //   console.log('QUERY', flightQuery);
  //   getFlights({
  //     variables: {
  //       ...flightQuery,
  //     },
  //   });
  // };

  const searchForFlights = (flightQuery) => {
    console.log(flightQuery);
    setOneWayOptions([]);
    setRoundTripOptions([]);
    if (flightQuery.inboundDate !== '') {
      getRoundTripFlights({
        variables: {
          startingAirport: flightQuery.startingAirport,
          endingAirport: flightQuery.endingAirport,
          outboundDate: flightQuery.outboundDate,
          inboundDate: flightQuery.inboundDate,
        },
      });
    } else {
      getOneWayFlights({
        variables: {
          startingAirport: flightQuery.startingAirport,
          endingAirport: flightQuery.endingAirport,
          outboundDate: flightQuery.outboundDate,
        },
      });
    }
  };

  return (
    <div className='App'>
      <FlightForm error={error} searchForFlights={searchForFlights} />
      {data && !loading && (
        <div>
          {roundTripOptions.map((f) => (
            <FlightDisplayCard key={f.id} flight={{ ...f }} />
          ))}
          {error && console.log(error)}
        </div>
      )}
      {oneWayData && !oneWayLoading && (
        <div>
          {oneWayOptions.map((f) => (
            <FlightDisplayCard key={f.id} flight={{ ...f }} />
          ))}
          {oneWayError && console.log(oneWayError)}
        </div>
      )}
    </div>
  );
}

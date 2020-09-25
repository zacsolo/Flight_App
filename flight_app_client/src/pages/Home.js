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

  return (
    <div className='App'>
      <FlightForm error={error} searchForFlights={searchForFlights} />
      <FlightDisplayCard />
      {data && !loading && (
        <div>
          {console.log(data.getCheapestFlightsForQuery)}
          {data.getCheapestFlightsForQuery.map((flight) => (
            <div
              key={flight.id}
              style={{ border: '3px solid blue', marginBottom: '5px' }}>
              <div style={{ border: '1px solid red' }}>
                <p>Price:{flight.price}</p>
                <p>Direct: {flight.direct ? 'Yes' : 'No'}</p>
              </div>
              <div style={{ border: '1px solid red' }}>
                <p>
                  Departure Date:{' '}
                  {moment(flight.departureDate).format('dddd, MMMM Do YYYY')}
                </p>
                <p> Carrier Name: {flight.outboundCarrierName}</p>
              </div>
              {flight.returnDate && (
                <div style={{ border: '1px solid red' }}>
                  <p>
                    Return Date:{' '}
                    {moment(flight.returnDate).format('dddd, MMMM Do YYYY')}
                  </p>
                  <p>Carrier Name: {flight.inboundCarrierName}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {error && console.log(error)}
    </div>
  );
}

// const GET_CHEAP_FLIGHTS = gql`
//   query getCheapestFlightsForQuery(
//     $startingAirport: String!
//     $endingAirport: String!
//     $outboundDate: String!
//     $inboundDate: String
//   ) {
//     getCheapestFlightsForQuery(
//       startingAirport: $startingAirport
//       endingAirport: $endingAirport
//       outboundDate: $outboundDate
//       inboundDate: $inboundDate
//     ) {
//       price
//       direct
//       departureDate
//       outboundCarrierName
//       returnDate
//       inboundCarrierName
//       id
//     }
//   }
// `;

import React, { useState } from 'react';
import { useLazyQuery, gql, useQuery } from '@apollo/client';

export default function Home() {
  const [value, setValue] = useState({
    from: '',
    to: '',
    departureDate: '',
    returnDate: '',
  });
  const [getFlights, { data, called, loading, error }] = useLazyQuery(
    GET_CHEAP_FLIGHTS
  );

  console.log('DATA', data);
  console.log('LOADING', loading);
  console.log('CALLED', called);
  console.log('ERROR', error);

  const handleChange = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    getFlights({
      variables: {
        startingAirport: value.from,
        endingAirport: value.to,
        outboundDate: value.departureDate,
        inboundDate: value.returnDate,
      },
    });
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className='App'>
      <form onSubmit={handleSubmit}>
        <input placeholder='From' name='from' onChange={handleChange} />
        <input placeholder='To' name='to' onChange={handleChange} />
        <input
          placeholder='Departure Date'
          name='departureDate'
          onChange={handleChange}
        />
        <input
          placeholder='Return Date'
          name='returnDate'
          onChange={handleChange}
        />
        <button type='submit'>Search</button>
      </form>
      {data && (
        <div>
          {data.getCheapestFlightsForQuery.map((flight) => (
            <div
              key={flight.id}
              style={{ border: '3px solid blue', marginBottom: '5px' }}>
              <div style={{ border: '1px solid red' }}>
                <p>Price:{flight.price}</p>
                <p>Direct: {flight.direct ? 'Yes' : 'No'}</p>
              </div>
              <div style={{ border: '1px solid red' }}>
                <p>Departure Date: {flight.departureDate}</p>
                <p> Carrier Name: {flight.outboundCarrierName}</p>
              </div>
              {flight.returnDate && (
                <div style={{ border: '1px solid red' }}>
                  <p>Return Date: {flight.returnDate}</p>
                  <p>Carrier Name{flight.inboundCarrierName}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const GET_CHEAP_FLIGHTS = gql`
  query getCheapestFlightsForQuery(
    $startingAirport: String!
    $endingAirport: String!
    $outboundDate: String!
    $inboundDate: String
  ) {
    getCheapestFlightsForQuery(
      startingAirport: $startingAirport
      endingAirport: $endingAirport
      outboundDate: $outboundDate
      inboundDate: $inboundDate
    ) {
      price
      direct
      departureDate
      outboundCarrierName
      returnDate
      inboundCarrierName
      id
    }
  }
`;

import { gql } from '@apollo/client';

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

export { GET_CHEAP_FLIGHTS };

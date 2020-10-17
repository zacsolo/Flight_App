import { gql } from '@apollo/client';
export const GET_AIRPORTS = gql`
  query findAirport($airportSearch: String!) {
    findAirport(airportSearch: $airportSearch) {
      placeId
      placeName
      regionId
      countryName
    }
  }
`;

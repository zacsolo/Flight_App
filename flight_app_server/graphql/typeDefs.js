const { gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    getCheapestFlightsForQuery(
      startingAirport: String!
      endingAirport: String!
      outboundDate: String!
      inboundDate: String
    ): [Flight]
    findAirport(airportSearch: String!): [Place]
    cheapestFlightsToAnywhere(
      startingAirport: String
      searchDate: String
      amountOfResults: Int
    ): [ExtendedFlightInfo]
  }
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    passwordHash: String!
    createdAt: String!
    token: String!
  }
  type Flight {
    price: Int!
    direct: Boolean!
    departureDate: String!
    returnDate: String
    outboundCarrierName: String!
    inboundCarrierName: String
    id: String!
    outboundOrigin: String!
    outboundDestination: String!
    inboundOrigin: String
    inboundDestination: String
  }
  type ExtendedFlightInfo {
    price: Int!
    direct: Boolean!
    departureDate: String!
    placeId: Int
    placeName: String
    cityName: String
    countryName: String!
    IataCode: String
    outboundCarrierName: String
    id: String!
  }
  type Place {
    placeId: String!
    placeName: String!
    regionId: String
    cityId: String
    countryId: String
    countryName: String
  }

  type Mutation {
    signup(
      firstName: String!
      lastName: String!
      email: String!
      password: String!
      confirmPassword: String!
    ): User
    login(email: String!, password: String!): User
  }
`;

module.exports = typeDefs;

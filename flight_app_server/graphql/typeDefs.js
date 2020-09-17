const { gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    getCheapestFlight(
      startingAirport: String!
      endingAirport: String!
      outboundDate: String!
    ): Flight
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
    price: Int
    direct: Boolean
    departureDate: String
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

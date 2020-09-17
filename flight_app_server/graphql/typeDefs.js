const { gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    test: String
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
  type Mutation {
    signup(
      firstName: String!
      lastName: String!
      email: String!
      password: String!
      confirmPassword: String!
    ): User
  }
`;

module.exports = typeDefs;

const userResolver = require('../resolvers/userResolver');
const flightResolver = require('./flightResolver');
const placeResolver = require('./placeResolver');
const savedFlightResolver = require('./savedFlightResolver');

const resolvers = {
  Query: {
    ...flightResolver.Query,
    ...placeResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
    ...savedFlightResolver.Mutation,
  },
};
module.exports = resolvers;

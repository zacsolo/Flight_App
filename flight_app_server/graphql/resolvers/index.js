const userResolver = require('../resolvers/userResolver');
const flightResolver = require('./flightResolver');
const placeResolver = require('./placeResolver');

const resolvers = {
  Query: {
    ...flightResolver.Query,
    ...placeResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
  },
};
module.exports = resolvers;

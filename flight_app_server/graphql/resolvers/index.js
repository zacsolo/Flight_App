const userResolver = require('../resolvers/userResolver');
const flightResolver = require('./flightResolver');

const resolvers = {
  Query: {
    ...flightResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
  },
};
module.exports = resolvers;

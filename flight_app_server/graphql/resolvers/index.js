const userResolver = require('../resolvers/userResolver');

const resolvers = {
  Query: {
    test: () => 'test resolver',
  },
  Mutation: {
    ...userResolver.Mutation,
  },
};
module.exports = resolvers;

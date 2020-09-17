const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
require('dotenv').config();
const resolvers = require('./graphql/resolvers');
const typeDefs = require('./graphql/typeDefs');

const PORT = process.env.port || 4000;
const MONGODB_URI = process.env.MONGODB_URI;
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

const isEmpty = (str) => {
  return str.trim() === '' ? (error.str = 'cannot be empty') : null;
};

const loginValidation = (str) => {
  const errors = {};
  isEmpty(str);
  return {
    errors,
    valid: errors.length < 1 ? true : false,
  };
};

console.log(loginValidation(''));

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Mongo DB Connected!');
    return server.listen({ port: PORT });
  })
  .then(({ url }) => {
    console.log(`Launching Server at ${url}`);
  })
  .catch((error) => console.error(error));

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import GlobalSearchStateContextProvider from './utils/context';
import { setContext } from '@apollo/client/link/context';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';

const httpLink = new createHttpLink({
  uri: 'http://localhost:4000',
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('userToken');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <GlobalSearchStateContextProvider>
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <ApolloProvider client={client}>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </ApolloProvider>
    </MuiPickersUtilsProvider>
  </GlobalSearchStateContextProvider>,
  document.getElementById('root')
);

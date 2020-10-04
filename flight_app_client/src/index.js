import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import GlobalSearchStateContextProvider from './utils/context';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';

const httpLink = new createHttpLink({
  uri: 'http://localhost:4000',
});

const client = new ApolloClient({
  link: httpLink,
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

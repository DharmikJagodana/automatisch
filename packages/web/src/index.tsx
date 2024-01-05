import React from 'react';
import ReactDOM from 'react-dom';
import ThemeProvider from 'components/ThemeProvider';
import IntlProvider from 'components/IntlProvider';
import ApolloProvider from 'components/ApolloProvider';
import SnackbarProvider from 'components/SnackbarProvider';
import MetadataProvider from 'components/MetadataProvider';
import { AuthenticationProvider } from 'contexts/Authentication';
import { AutomatischInfoProvider } from 'contexts/AutomatischInfo';
import Router from 'components/Router';
import LiveChat from 'components/LiveChat/index.ee';
import routes from 'routes';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <Router>
    <AuthenticationProvider>
      <ApolloProvider>
        <AutomatischInfoProvider>
          <IntlProvider>
            <ThemeProvider>
              <SnackbarProvider>
                <MetadataProvider>
                  {routes}
                  <LiveChat />
                </MetadataProvider>
              </SnackbarProvider>
            </ThemeProvider>
          </IntlProvider>
        </AutomatischInfoProvider>
      </ApolloProvider>
    </AuthenticationProvider>
  </Router>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

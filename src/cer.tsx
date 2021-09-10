require("./polyfill");
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import { configureStore } from './store';
import Layout from './containers/Layout/cerReport';
import AppRoutes from './routes/cer';
import {ConnectedRouter } from 'react-router-redux';
import { initializeIcons } from "office-ui-fabric-react/lib/Icons";

import '!style-loader!css-loader!./cer.css';
import '!style-loader!css-loader!./sb-admin.css';

initializeIcons();

const store = configureStore();
const history = createBrowserHistory();


ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
    <Layout history={history} {...this.props}>
      <AppRoutes />
      </Layout>
    </ConnectedRouter>

  </Provider>
  ,document.getElementById('root')
);

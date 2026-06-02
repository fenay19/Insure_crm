// index.js or main.js

import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';

import App from 'layout/App';
import { store, persistor } from './store/reduxStore'; // updated import
import * as serviceWorker from 'serviceWorker';
import 'assets/scss/style.scss';

const root = createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>
);

serviceWorker.unregister();

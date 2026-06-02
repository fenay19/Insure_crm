// store/store.js

import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage
import { baseApi } from '../services/baseApi';
import reducer from './reducer'; // your combined reducers

// persist config
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth', 'customization'] // only persist these slices
};

const persistedReducer = persistReducer(persistConfig, reducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }).concat(baseApi.middleware)
});

const persistor = persistStore(store);

export { store, persistor };

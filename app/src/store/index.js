import { createStore, applyMiddleware } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReduxThunk from 'redux-thunk';
import rootReducer from './reducers';

const rootPersistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

const store = createStore(persistedReducer, {}, applyMiddleware(ReduxThunk));

const persistor = persistStore(store);

export { store, persistor };

import { combineReducers } from '@reduxjs/toolkit';
import AppReducer from './app.reducer';
import AuthReducer from './auth.reducer';
import UserReducer from './user.reducer';

export default combineReducers({
  app: AppReducer,
  auth: AuthReducer,
  user: UserReducer,
});

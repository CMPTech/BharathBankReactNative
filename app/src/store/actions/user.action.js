import { SET_ACC_DETAILS, SET_USER, SET_ACC_REFRESH } from '../constants';

export const setUser = payload => {
  return { type: SET_USER, payload };
};

export const setAccountDetails = payload => { ({ type: SET_ACC_DETAILS, payload }) };

export const setRefreshAccdata = (payload) => ({ type: SET_ACC_REFRESH, payload })

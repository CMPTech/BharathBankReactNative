import { SET_AUTH_TOKEN, SET_BIOMETRIC_ENABLED, SET_IP_ADDRESS } from '../constants';

export const setAuthToken = payload => ({ type: SET_AUTH_TOKEN, payload });
export const setIpAddress = payload => ({ type: SET_IP_ADDRESS, payload });



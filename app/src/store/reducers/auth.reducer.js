import { RESET_AUTH, SET_IP_ADDRESS, SET_AUTH_TOKEN, SET_BIOMETRIC_ENABLED } from '../constants';

const initialState = { authToken: null, ipAddress: null, };

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_AUTH_TOKEN:
      return { ...state, authToken: payload };
    case SET_IP_ADDRESS:
      return { ...state, ipAddress: payload };
  
    case RESET_AUTH:
      return initialState;
    default:
      return state;
  }
};

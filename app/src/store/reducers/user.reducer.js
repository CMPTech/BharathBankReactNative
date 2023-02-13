import { SET_USER, RESET_USER, SET_ACC_DETAILS, DEFAULT_ACC_INDEX, HAS_DEBIT_CARD, SET_REFRESH_TOKE, SET_ACC_REFRESH } from '../constants';

const initialState = {
  accDetails: [],
  refreshAccData: false
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_ACC_DETAILS:
      return { ...state, accDetails: payload };
    case SET_ACC_REFRESH:
      return { ...state, refreshAccData: payload };
    case RESET_USER:
      return initialState;
    default:
      return state;
  }
};

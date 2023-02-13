import {
  SET_APP_LANGUAGE,
  SET_MOBILE_NUMBER,
  SET_SEARCH_LOCATION,
  SET_PROFILE,
  SET_META_DATA,
  SET_MPIN_DATA,
  SET_USER_DETAILS,
  SET_SELECTED_AVATAR,
  SET_USER_LOGIN_FIRST,
  SET_PROFILE_IMAGE,
  SET_SELECTED_RANDOM_KEY,
  SET_BIOMETRIC_ENABLED
} from '../constants';
const initialState = {
  language: 'en',
  location: [],
  mobileNumber: null,
  profile: null,
  metaData: [],
  mPinData: null,
  userDetails: null,
  selectedAvartar: "One",
  isUserLoginFirst: true,
  userProfileImage: null,
  randomKey: '',
  isBiometricEnabled: false
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_APP_LANGUAGE:
      return { ...state, app: payload };
    case SET_SEARCH_LOCATION:
      return { ...state, location: payload }
    case SET_MOBILE_NUMBER: {
      return { ...state, mobileNumber: payload }
    }
    case SET_PROFILE: {
      return { ...state, profile: payload }
    }
    case SET_META_DATA: {
      return { ...state, metaData: payload }
    }
    case SET_MPIN_DATA: {
      return { ...state, mPinData: payload }
    }
    case SET_USER_DETAILS: {
      return { ...state, userDetails: payload }
    }
    case SET_SELECTED_AVATAR: {
      return { ...state, selectedAvartar: payload }
    }
    case SET_USER_LOGIN_FIRST: {
      return { ...state, isUserLoginFirst: payload }
    }
    case SET_PROFILE_IMAGE: {
      return { ...state, userProfileImage: payload }
    }
    case SET_SELECTED_RANDOM_KEY: {
      return { ...state, randomKey: payload }
    }
    case SET_BIOMETRIC_ENABLED:
      return { ...state, isBiometricEnabled: payload };
    default:
      return state;
  }
};

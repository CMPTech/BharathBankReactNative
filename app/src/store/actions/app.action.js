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
export const setAppLanguage = (payload) => ({ type: SET_APP_LANGUAGE, payload });
export const setAppSearchLocation = (payload) => ({ type: SET_SEARCH_LOCATION, payload })
export const setAppMobileNumber = (payload) => ({ type: SET_MOBILE_NUMBER, payload })
export const setProfileSelected = (payload) => ({ type: SET_PROFILE, payload })

export const setMetaData = (payload) => ({ type: SET_META_DATA, payload })
export const setMpinData = (payload) => ({ type: SET_MPIN_DATA, payload })
export const setSelectedRandomKey = (payload) => ({ type: SET_SELECTED_RANDOM_KEY, payload });
export const setUserDetails = (payload) => ({ type: SET_USER_DETAILS, payload });

export const setSelectedAvatar = (payload) => ({ type: SET_SELECTED_AVATAR, payload });
export const setUserFirstLogin = (payload) => ({ type: SET_USER_LOGIN_FIRST, payload });
export const setUserProfileImage = (payload) => ({ type: SET_PROFILE_IMAGE, payload });
export const setBiometricEnabled = payload => ({ type: SET_BIOMETRIC_ENABLED, payload });
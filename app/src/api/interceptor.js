import axios from 'axios';
import { Platform } from 'react-native';
import { store } from '../store';
import { SET_AUTH_TOKEN, SET_IP_ADDRESS, SET_REFRESH_TOKE } from '../store/constants';
import { NetworkInfo } from 'react-native-network-info';
// import DeviceInfo from 'react-native-device-info';
import { getUniqueId } from 'react-native-device-info'
import { kickUser } from '../utils/auth.service';

//axios.defaults.timeout = 60000,

axios.interceptors.request.use(
  async config => {
    const { auth, app } = store.getState();
    const interceptedConfig = config;
    interceptedConfig.headers['Content-type'] = 'application/json';
    if (auth.authToken) {
      interceptedConfig.headers.Authorization = `Bearer ${auth.authToken}`;
    }
    if (interceptedConfig.method === 'post') {
      if (Platform.OS === 'ios') {
        interceptedConfig.data.channelType = 'IOS'
      } else if (Platform.OS === 'android') {
        interceptedConfig.data.channelType = 'ANDROID'
      }
      await getUniqueId().then(data => {
        interceptedConfig.data.deviceId = data
        interceptedConfig.data.userName = data
      })

      interceptedConfig.data.language = 'en';
      // Get IPv4 IP (priority: WiFi first, cellular second)
      // if (auth.ipAddress === null) {
      var currentIPAddress = await NetworkInfo.getIPV4Address().then(ipv4Address => {
        interceptedConfig.data.ipAddress = ipv4Address;
        //store.dispatch({ type: SET_IP_ADDRESS, payload: ipv4Address });
      });
      // } else {
      //   interceptedConfig.data.ipAddress = auth.ipAddress;
      // }
    }
    console.log(interceptedConfig.url)
    //console.log(interceptedConfig.headers)
    console.log(interceptedConfig.data)
    return interceptedConfig;
  },
  error => Promise.reject(error),
);
axios.interceptors.response.use(
  response => {
    console.log(response.data)
    if (response.headers.authorization) {
      store.dispatch({
        type: SET_AUTH_TOKEN,
        payload: response.headers.authorization,
      })
    }
    if (response.headers.access_token) {
      store.dispatch({
        type: SET_AUTH_TOKEN,
        payload: response.headers.access_token,
      })
    }

    return response

  },
  async (error) => {

    var e_message = error.response.data !== undefined ? error.response.data : {
      error: error,
      message: 'The server is not reachable. Please try after some time.',
      status: 500,
      timestamp: '2021-04-16T07:22:25.172+00:00',
    }
    if (
      e_message.code === "SMB-0001" || e_message.code === "AGCM-0002"
      || e_message.status === 440 || e_message.status === 403
    ) {
      await kickUser()
    }

console.log(e_message)
    return Promise.reject(e_message)

    // if (error.response) {

    //   console.log(error.response.data)
    //   if (
    //     error.response.status === 401 ||
    //     error.response.status === 440 || error.response.status === 403
    //   ) {
    //     await kickUser()
    //   }
    //   return Promise.reject(error.response.data)
    // } else {
    //   //return Promise.reject(error.response.data)
    //   return Promise.reject({
    //     response: {
    //       data: {
    //         error: error,
    //         message: 'The server is not reachable. Please try after some time.',
    //         status: 500,
    //         timestamp: '2021-04-16T07:22:25.172+00:00',
    //       },
    //     },
    //   })
    // }
  }
);
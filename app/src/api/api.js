import axios from 'axios';
import config from './constants';
import './interceptor';

const http = {
  get: async (url, headers) =>
    axios.get(config.constants.BASE_URL + url, headers),
  post: async (url, data = {}, headers = {}) =>
    axios.post(config.constants.BASE_URL + url, data, headers),

  postExchange: async (url, data = {}, headers = {}) =>
    axios.post(config.constants.BASE_URL_EXCHANGE + url, data, headers),
 getMap: async (url, headers) =>
    axios.get(
      'https://maps.googleapis.com/maps/api/place/details/json?placeid='+url,
      headers
    ),
};

export default http;

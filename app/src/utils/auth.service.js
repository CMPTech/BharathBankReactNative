import axios from 'axios'
import NavigationService from './navigation.service'
import { store } from '../store'
import { AUTH_ROUTES, GET_STARTED, SPLASH } from '../routes'
import config from '../api/constants'
import { RESET_AUTH, RESET_USER } from '../store/constants'
import * as RootNavigation from './RootNavigation';

// eslint-disable-next-line import/prefer-default-export
export const kickUser = async () => {
  try {
    await axios.post(config.apiRoute.LOGOUT)
    store.dispatch({ type: RESET_AUTH })
    store.dispatch({ type: RESET_USER })
    // NavigationService.navigate(GET_STARTED, {
    //   kicked: true,
    // })
    RootNavigation.navigate(SPLASH)
  } catch (error) {
    store.dispatch({ type: RESET_AUTH })
    store.dispatch({ type: RESET_USER })
    RootNavigation.navigate(SPLASH)
  }
}

export const kickUserNoInternet = async () => {
  try {
    // await axios.post(config.apiRoute.LOGOUT)
    // store.dispatch({ type: RESET_ACCOUNTS })
    // store.dispatch({ type: RESET_AUTH })
    // store.dispatch({ type: RESET_APP })
    RootNavigation.navigate(SPLASH)
  } catch (error) {
    // store.dispatch({ type: RESET_ACCOUNTS })
    // store.dispatch({ type: RESET_AUTH })
    // store.dispatch({ type: RESET_APP })
    RootNavigation.navigate(SPLASH)
  }
}

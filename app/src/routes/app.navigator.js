import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import SplashStack from './splash'
//import AuthStack from './auth'
//import DashboardStack from './dashboard'
import { navigationOptions } from './index'
const AppNavigator = createSwitchNavigator({
  SplashStack,
}, {
  navigationOptions
})

const AppContainer = createAppContainer(AppNavigator)

export default AppContainer

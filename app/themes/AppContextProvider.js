import React, { useEffect, useState } from 'react'
import { AppState, SafeAreaView, StatusBar, View, Image } from 'react-native'
import { Provider as PaperProvider } from 'react-native-paper'
import { SIZES } from '../styles/global.config'
import { BCBTheme, TechurateTheme } from './Themes'

export const AppContext = React.createContext(null)

export default ({ children }) => {

    const STATUSBAR_HEIGHT = StatusBar.currentHeight;
    const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;


    const [theme, changeTheme] = useState(TechurateTheme)



    const [appState, setAppState] = useState(AppState.currentState);




    // useEffect(() => {
    //     AppState.addEventListener(
    //         "change",
    //         nextAppState => {
    //             if (
    //                 appState.match(/inactive|background/) &&
    //                 nextAppState === "active"
    //             ) {

    //             }
    //             setAppState(nextAppState);
    //            // console.log("App  " + nextAppState);
    //         }
    //     );
    // });

    const MyStatusBar = ({ backgroundColor, ...props }) => (
        <View style={{ height: STATUSBAR_HEIGHT, backgroundColor }}>
            <SafeAreaView>
                <StatusBar translucent backgroundColor={backgroundColor} {...props} />
            </SafeAreaView>
        </View>
    );


    return (
        <AppContext.Provider value={{ theme: theme, changeTheme }}>
            <PaperProvider theme={theme}>
                <MyStatusBar backgroundColor={"#3356e5"} barStyle="light-content" />

                {/* {appState === 'inactive' &&
                    <Image source={require('./../assets/images/splash_img.png')}
                        resizeMode="contain"
                        style={{
                            width: SIZES.width,
                            height: SIZES.height
                        }} />
                } */}
                {children}
            </PaperProvider>
        </AppContext.Provider>
    )
}
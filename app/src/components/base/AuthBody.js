import React, { useEffect, useState, useContext } from "react";
import {
    View,
    Text,
    Keyboard,
    Dimensions,
    ScrollView,
    Image
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BodyDesignIcon } from "../../../assets/svg";
import { colors, fontSize } from "../../../styles/global.config";
import AuthHeader from "./AuthHeader";
import HeaderTitleText from "./HeaderTitleText";
import LinearGradient from 'react-native-linear-gradient';
import { AppContext } from "../../../themes/AppContextProvider";
import { SkypeIndicator, MaterialIndicator, PulseIndicator, UIActivityIndicator, BarIndicator } from "react-native-indicators";
import PlainButton from "../button/PlainButton";
import { Platform } from "react-native";
import { ThemeColors } from "react-navigation";

export default function AuthBody({
    children,
    refRBSheet,
    isLoading = false,
    isLoginPage,
    title,
    navigation,
    scrollable,
    hideHeader
}) {

    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    const { height } = Dimensions.get('window');
    const UNFOCUSED_HEIGHT = (height * 57) / 100;
    const FOCUSED_HEIGHT = (height * 87) / 100;


    const { theme, changeTheme } = useContext(AppContext)

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true); // or some other action
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false); // or some other action
            }
        );
        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    return (

        <SafeAreaView
            style={{
                flex: 1,
                height: isKeyboardVisible ? FOCUSED_HEIGHT : UNFOCUSED_HEIGHT,
            }}>
            {/* <LinearGradient
                style={{
                    flex: 1,
                }}
                useAngle={true}
                angle={45}
                angleCenter={{ x: 0.5, y: 0.5 }}
                colors={[theme.colors.mainBackground1, theme.colors.mainBackground2]} > */}
            {!hideHeader &&
                <AuthHeader title={title}
                    navigation={navigation} />
            }
            <ScrollView
                scrollEnabled={scrollable}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}>
                {children}
            </ScrollView>
            {/* </LinearGradient> */}

            {isLoading && (

                <View style={{
                    height: '100%',
                    position: "absolute",
                    left: 0,
                    right: 0,
                    //top: 0,
                    bottom: 0,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: 'rgba(52, 52, 52, 0.8)'
                }}>
                    {/* <UIActivityIndicator size={100} color={theme.colors.buttonColor} /> */}
                    <View style={{
                        width: '100%', padding: 30,
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: theme.colors.white
                    }}>
                        {/* <BarIndicator color={theme.colors.buttonStrokeStartColor} /> */}
                        <Image
                            style={{ alignSelf:'center',width:70,height:70 }}
                            source={require('./../../../assets/images/loader_flip.gif')} />
                        <Text style={{ textAlign: 'center', padding: 10 ,color:theme.colors.grey,fontSize:fontSize.header3}}>Loading</Text>
                    </View>
                </View>



            )}

        </SafeAreaView>
    );
}


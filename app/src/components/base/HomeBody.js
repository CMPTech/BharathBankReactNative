import React, { useEffect, useState, useContext } from "react";
import {
    View,
    Text,
    Keyboard,
    Dimensions,
    ScrollView,
    TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BodyDesignIcon } from "../../../assets/svg";
import { colors } from "../../../styles/global.config";
import AuthHeader from "./AuthHeader";
import HeaderTitleText from "./HeaderTitleText";
import LinearGradient from 'react-native-linear-gradient';
import { AppContext } from "../../../themes/AppContextProvider";
import HomeHeader from "./HomeHeader";
import { SkypeIndicator, MaterialIndicator, PulseIndicator, UIActivityIndicator } from "react-native-indicators";
import NavAccountsIcon from "../../../assets/svg/nav-accounts.icon";
import StyleTextView from "../input/StyleTextView";
import NavPortfolioIcon from "../../../assets/svg/nav-portfolio.icon";
import NavTransfersIcon from "../../../assets/svg/nav-transfer.icon";
import NavMoreIcon from "../../../assets/svg/nav-more.icon";
import { Platform } from "react-native";


export default function HomeBody({
    children,
    refRBSheet,
    title,
    isLoading = false,
    isMainPage,
    navigation }) {

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
                height: isKeyboardVisible ? FOCUSED_HEIGHT : UNFOCUSED_HEIGHT
            }}>
            <LinearGradient
                style={{
                    flex: 1,
                }}
                useAngle={true}
                angle={45}
                angleCenter={{ x: 0.5, y: 0.5 }}
                colors={[theme.colors.homeBackground1, theme.colors.homeBackground2]} >
                <HomeHeader title={title} isMainPage={isMainPage} navigation={navigation} />

                <ScrollView>
                    {children}
                </ScrollView>
            </LinearGradient>

            {isLoading && (
                <View style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <UIActivityIndicator size={100} color={theme.colors.buttonColor} />
                </View>
            )}

            {Platform.OS === 'ios' &&
                <View style={{ height: isKeyboardVisible ? 200 : 0, backgroundColor: 'transparent' }} >
                </View>
            }


            {/* <View style={{
                bottom: 0,
                backgroundColor: theme.colors.homeBackground1,
                shadowOffset: {
                    width: 0,
                    height: 3
                },
                shadowRadius: 5,
                shadowOpacity: 0.1,
                alignContent: 'center',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
                padding: 10,
                borderTopWidth: theme.paddings.boderWidth,
            }}>
                <View style={{boderWidth:1}}>
                <TouchableOpacity style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center', }}>
                    <NavAccountsIcon />
                    <StyleTextView value={"Accounts"} style={{ color: theme.colors.headingTextColor }} />
                </TouchableOpacity>
                </View>
               
                <TouchableOpacity style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                    <NavPortfolioIcon />
                    <StyleTextView value={"Portfolio"} style={{ color: theme.colors.headingTextColor }} />
                </TouchableOpacity>
               
                <TouchableOpacity style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                    <NavTransfersIcon />
                    <StyleTextView value={"Transfer"} style={{ color: theme.colors.headingTextColor }} />
                </TouchableOpacity>
               
                <TouchableOpacity style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                    <NavMoreIcon />
                    <StyleTextView value={"More"} style={{ color: theme.colors.headingTextColor }} />
                </TouchableOpacity>

            </View> */}
        </SafeAreaView>
    );
}


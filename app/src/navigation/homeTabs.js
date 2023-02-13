import React, { useContext } from "react";
import { View, Text, Image } from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AppContext } from "../../themes/AppContextProvider";
import DashboardScreen from "../screens/home/DashboardScreen";
import StyleTextView from "../components/input/StyleTextView";
import { fontName, fontSize } from "../../styles/global.config";
import AccountsScreen from "../screens/home/AccountsScreen";
import ScanScreen from "../screens/home/ScanScreen";
import LimitScreen from "../screens/home/LimitScreen";
const Tab = createBottomTabNavigator();



const tabOptions = {
    showLabel: false,
    style: {
        height: "10%",
    },
};


const HomeTabs = () => {

    const { theme, changeTheme } = useContext(AppContext)

    return (
        <Tab.Navigator
            tabBarOptions={tabOptions}
            screenOptions={({ route }) => ({
                headerShown: false,
                "tabBarShowLabel": false,
                "tabBarStyle": [
                    {
                        "display": "flex"
                    },
                    null
                ],
                tabBarHideOnKeyboard: true,
                tabBarIcon: ({ focused }) => {
                    const tintColor = focused ? theme.colors.black : theme.colors.grey;

                    switch (route.name) {
                        case "Home":
                            return (
                                <View style={{ alignItems: 'center' }}>
                                    <Image
                                        source={require('../../assets/icons/home.png')}
                                        resizeMode="contain"
                                        style={{
                                            tintColor: tintColor,
                                            width: 25,
                                            height: 25
                                        }}
                                    />
                                    <StyleTextView value={"Home"}
                                        numberOfLines={1}
                                        style={{
                                            fontSize: fontSize.textSmall,
                                            fontFamily: fontName.regular,
                                            color: tintColor,
                                            textAlign: 'center'
                                        }} />
                                </View>
                            );
                        case "Accounts":
                            return (
                                <View style={{ alignItems: 'center' }}>
                                    <Image
                                        source={require('../../assets/icons/accounts.png')}
                                        resizeMode="contain"
                                        style={{
                                            tintColor: tintColor,
                                            width: 25,
                                            height: 25
                                        }}
                                    />
                                    <StyleTextView value={"Accounts"}
                                        numberOfLines={1}
                                        style={{
                                            fontSize: fontSize.textSmall,
                                            fontFamily: fontName.regular,
                                            color: tintColor,
                                            textAlign: 'center'
                                        }} />
                                </View>
                            );
                        case "Scan":
                            return (
                                <View style={{ alignItems: 'center' }}>
                                    <Image
                                        source={require('../../assets/icons/scan.png')}
                                        resizeMode="contain"
                                        style={{
                                            //tintColor: tintColor,
                                            width: 35,
                                            height: 35
                                        }}
                                    />
                                    {/* <StyleTextView value={"Home"} style={{
                                    fontSize: fontSize.textSmall,
                                    fontFamily: fontName.regular,
                                    color: tintColor,
                                    textAlign: 'center'
                                }} /> */}
                                </View>
                            );
                        case "Limits":
                            return (
                                <View style={{ alignItems: 'center' }}>
                                    <Image
                                        source={require('../../assets/icons/limits.png')}
                                        resizeMode="contain"
                                        style={{
                                            tintColor: tintColor,
                                            width: 25,
                                            height: 25
                                        }}
                                    />
                                    <StyleTextView value={"Limits"}
                                        numberOfLines={1}
                                        style={{
                                            fontSize: fontSize.textSmall,
                                            fontFamily: fontName.regular,
                                            color: tintColor,
                                            textAlign: 'center'
                                        }} />
                                </View>
                            );
                        case "My Request":
                            return (
                                <View style={{ alignItems: 'center' }}>
                                    <Image
                                        source={require('../../assets/icons/request.png')}
                                        resizeMode="contain"
                                        style={{
                                            tintColor: tintColor,
                                            width: 25,
                                            height: 25
                                        }}
                                    />
                                    <StyleTextView value={"My Request"}
                                        numberOfLines={1}
                                        style={{
                                            fontSize: fontSize.textSmall,
                                            fontFamily: fontName.regular,
                                            color: tintColor,
                                            textAlign: 'center'
                                        }} />
                                </View>
                            );
                    }
                }
            })}
        >
            <Tab.Screen
                name="Home"
                component={DashboardScreen}
            />
            <Tab.Screen
                name="Accounts"
                component={AccountsScreen}
            />
            <Tab.Screen
                name="Scan"
                component={ScanScreen}
            />
            <Tab.Screen
                name="Limits"
                component={LimitScreen}
            />
        </Tab.Navigator>
    );
};

export default HomeTabs;

import React, { useState, useEffect, useContext } from "react";
import { View, TouchableOpacity, Image, Text, ImageBackground, Dimensions, Platform } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, useDrawerProgress } from '@react-navigation/drawer';
import MainHomeScreen from './MainHomeScreen';
import Animated from "react-native-reanimated";
import { fontName, fontSize, SIZES, FONTS } from "../../../styles/global.config";
import {
    rightArrow
} from '../../../assets/icons'
import { profile } from '../../../assets/images';
import { imageBackground } from '../../../assets/images';
import { AUTH, CALL_US, GET_STARTED, HOME, PAY_PEOPLE, SERVICES, SETTINGS } from "../../routes";
import DrawerDashboardIcon from "../../../assets/svg/drawer_dashboard.icon";
import DrawerCardSettingIcon from "../../../assets/svg/drawer_card_setting.icon";
import DrawerSendMoneyIcon from "../../../assets/svg/drawer_send_money.icon";
import DrawerBillsRechargeIcon from "../../../assets/svg/drawer_bills_recharge.icon";
import DrawerServiceIcon from "../../../assets/svg/drawer_service.icon";
import DrawerMyActivityIcon from "../../../assets/svg/drawer_my_activity.icon";
import DrawerSettingsIcon from "../../../assets/svg/drawer_settings.icon";
import DrawerHelpIcon from "../../../assets/svg/drawer_help.icon";
import { BackIcon } from '../../../assets/svg';
import DrawerLogoutIcon from "../../../assets/svg/drawer_logout.icon";
import RightArrowIcon from "../../../assets/svg/right_arrow.icon";
import { AppContext } from "../../../themes/AppContextProvider";
import { AUTH_KEYS } from '../../../assets/translations/constants';
import { avatarSelector, userProfileSelector } from "../../store/selectors";
import { useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import {
    avatarOne,
    avatarTwo,
    avatarThree,
    avatarFour,
    avatarFive,
    avatarSix,
    avatarSeven,
    avatarEight,
    avatarNine,
} from '../../../assets/icons';
const Drawer = createDrawerNavigator();
const CustomDrawer = ({ route }) => {
    const avatarSelected = useSelector(avatarSelector);
    const { t, i18n } = useTranslation();
    const profileImg = useSelector(userProfileSelector);
    const profileImage = [{ icon: avatarOne, selected: false, name: "One" },
    { icon: avatarTwo, selected: false, name: "Two" },
    { icon: avatarThree, selected: false, name: "Three" },
    { icon: avatarFour, selected: false, name: "Four" },
    { icon: avatarFive, selected: false, name: "Five" },
    { icon: avatarSix, selected: false, name: "Six" },
    { icon: avatarSeven, selected: false, name: "Seven" },
    { icon: avatarEight, selected: true, name: "Eight" },
    { icon: avatarNine, selected: false, name: "Nine" },]
    const { theme, changeTheme } = useContext(AppContext)
    const [selectedTab, setSelectedTab] = useState('');
    const [progress, setProgress] = useState(new Animated.Value(0));
    const [mainDrawer, setMainDrawer] = useState(true);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const profiledata = route.params.profiledata
    const loginResponse = route.params.loginResponse
    const subMenu = {
        myAccount: [{ title: "Banking accounts", route: '', navigationPararms: {} }, { title: "Deposits", route: '', navigationPararms: {} }, { title: "Loans", route: '', navigationPararms: {} }, { title: "Spend analyser", route: '', navigationPararms: {} }, { title: "ePassbook", route: '', navigationPararms: {} }, { title: "Detailed statement", route: '', navigationPararms: {} }],
        settings: [
            { title: t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.CHANGE_PIN), route: SETTINGS.CHANGE_MPIN_1, navigationPararms: profiledata },
            { title: t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.TOUCHED_ID_ACCESS), route: SETTINGS.TOUCH_ID, navigationPararms: {} },
            { title: t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.TRANSFER_LIMIT), route: SETTINGS.TRANSACTION_LIMIT, navigationPararms: profiledata },
            { title: t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.SECURITY_QUESTIONS), route: SETTINGS.SECURITY_QUESTIONS_ANSWERS, navigationPararms: {} },
            { title: t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.SET_PRIMARY_ACCOUNT), route: SETTINGS.SET_PRIMARY_ACCOUNT, navigationPararms: profiledata },
            { title: "FD Interest calculator", route: SETTINGS.FD_INTEREST_CALCULATOR, navigationPararms: profiledata }
        ],
        sendMoney: [{ title: t(AUTH_KEYS.MAIN_SCREEN.PAY_PEOPLE), route: PAY_PEOPLE.MENU, navigationPararms: {} }, { title: t(AUTH_KEYS.PAY_PEOPLE.ADD_PAYEE), route: PAY_PEOPLE.ADD_PAYEE, navigationPararms: { bankName: '', branchName: '', ifsc: '' } }, { title: t(AUTH_KEYS.PAY_PEOPLE.PAYEMENT_HISTORY), route: PAY_PEOPLE.PAYEE_HISTORY, navigationPararms: {} }, { title: t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.PAYEMNT_AUTHORIZATION), route: PAY_PEOPLE.AUTHORISATION_LIST, navigationPararms: {} }, { title: t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.SCHEDULED_TRANSFERS), route: PAY_PEOPLE.SCHEDULED_TRANSFERS, navigationPararms: {} }],
        bills: [{ title: "Bill  history", route: '', navigationPararms: {} },],
        service: [{ title: t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.NEW_CHEQUE_BOOK), route: SERVICES.NEW_CHEQUE_BOOK, navigationPararms: {} }, { title: t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.CHEQUE_STATUS), route: SERVICES.CHEQUE_STATUS, navigationPararms: {} },], //{ title: "Debit card", route: SERVICES.DEBIT_CARD, navigationPararms: {} }, { title: "eStatement request", route: '', navigationPararms: {} },//{ title: "Clearing cheques", route: SERVICES.CHEQUE_STATUS, navigationPararms: {} },  { title: "Deposited cheques", route:SERVICES.DEPOSITED_BY_ME, navigationPararms: {} },
       // service: [{ title: t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.NEW_CHEQUE_BOOK), route: SERVICES.NEW_CHEQUE_BOOK, navigationPararms: {} }, { title: t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.CHEQUE_STATUS), route: SERVICES.CHEQUE_STATUS, navigationPararms: {} }, ], //{ title: "Debit card", route: SERVICES.DEBIT_CARD, navigationPararms: {} }, { title: "eStatement request", route: '', navigationPararms: {} },//{ title: "Clearing cheques", route: SERVICES.CHEQUE_STATUS, navigationPararms: {} },  { title: "Deposited cheques", route:SERVICES.DEPOSITED_BY_ME, navigationPararms: {} },
        myActivity: [{ title: "Payment history", route: PAY_PEOPLE.PAYEE_HISTORY, navigationPararms: {} }, { title: "Other activity", route: HOME.MY_ACTIVITY, navigationPararms: {} }, { title: "Scheduled transfers", route: PAY_PEOPLE.SCHEDULED_TRANSFERS, navigationPararms: {} }, { title: "Bills", route: '', navigationPararms: {} }],
    }
    useEffect(() => {
        setSelectedProfile(profiledata.filter(v => v.isSelected === true)[0])
    }, []);

    const [scaleData, setScaleData] = useState(1);

    const scale = Animated.interpolateNode(progress, {
        inputRange: [0, 1],
        outputRange: [1, 0.8]
    })

    state = {
        fadeValue: new Animated.Value(1)
    };



    const borderRadius = Animated.interpolateNode(progress, {
        inputRange: [0, 1],
        outputRange: [0, 26]
    })
    const animatedStyle = { transform: [{ scale: 1 }] }

    const CustomDrawerSubItem = ({ label, onPress }) => {
        return (<TouchableOpacity
            style={{
                flexDirection: 'row', height: 30, marginBottom: SIZES.base, alignItems: 'center', justifyContent: 'space-between',
                paddingLeft: SIZES.radius, borderRadius: SIZES.base,
            }}
            onPress={onPress}
        >
            <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                <Text style={{
                    marginLeft: 15,
                    color: "#FFF",
                    ...FONTS.h3,
                    opacity: 0.7,
                    fontFamily: fontName.regular
                }}>{label}</Text>
            </View>
        </TouchableOpacity>)
    }

    const CustomDrawerItem = ({ label, icons, isFocused, onPress, hasSubMenu }) => {
        return (<TouchableOpacity
            style={{
                flexDirection: 'row', height: 50, marginBottom: SIZES.base, alignItems: 'center', justifyContent: 'space-between',
                paddingLeft: SIZES.radius, borderRadius: SIZES.base, backgroundColor: isFocused ? null : null//"rgba(0, 0, 0, 0.1)"
            }}
            onPress={onPress}
        >
            {/* <Image
                source={<icons/>}
                style={{
                    width: 20,
                    height: 20,
                    margin: 5,
                    tintColor: "#FFF"
                }}
            /> */}
            <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                {icons ? icons : null}
                <Text style={{
                    marginLeft: 15,
                    color: "#FFF",
                    ...FONTS.h3,
                    fontFamily: fontName.medium
                }}>{label}</Text>
            </View>
            {hasSubMenu &&
                // <Image
                //     style={{ width: 20, height: 20, justifyContent: 'flex-end', tintColor: "#FFF" }}
                //     source={rightArrow}
                // />
                <RightArrowIcon color1={theme.colors.white} />
            }


        </TouchableOpacity>)
    }
    const CustomDrawerSubContent = ({ navigation, subMenuList, title }) => {
        return (
            <DrawerContentScrollView
                scrollEnabled={true}
                contentContainerStyle={{ flex: 1, width: '100%' }}>
                <View style={{
                    flex: 1,
                    width: '100%'
                }}>
                    {/* Profile */}
                    <TouchableOpacity
                        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30, backgroundColor: "rgba(0, 0, 0, 0.03)", width: '100%', paddingHorizontal: 20, height: 60 }}
                        onPress={() => {
                            setMainDrawer(true)
                        }
                        }
                    >
                        <BackIcon />
                        <View style={{ marginLeft: SIZES.radius }}>
                            <Text style={{ color: "#FFFF", ...FONTS.body2, textAlign: 'center', fontName: fontName.semi_bold }}>
                                {
                                    title
                                }
                            </Text>
                        </View>
                    </TouchableOpacity>
                    {/* Drawer Items */}
                    {subMenuList.map((item, index) => {
                        return (
                            <CustomDrawerSubItem
                                label={item.title}
                                onPress={() => {
                                    setMainDrawer(true)
                                    navigation.navigate(item.route, item.navigationPararms)

                                }}
                            />
                        )
                    })

                    }

                </View>
            </DrawerContentScrollView>)
    }
    const CustomDrawerContent = ({ navigation, setSelectedTab }) => {

        const progress = useDrawerProgress();

        setTimeout(() => {
            if (progress.value === 1) {
                setScaleData(0.8)
            } else {
                setScaleData(1)
            }

        }, 1000)




        return (
            <DrawerContentScrollView
                scrollEnabled={true}
                contentContainerStyle={{ flex: 1 }}>
                <View style={{
                    flex: 1,
                    paddingHorizontal: 10
                }}>
                    {/* Profile */}
                    <TouchableOpacity
                        onPress={() => { navigation.navigate(HOME.PROFILE_DETAILS) }
                        }
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30, marginTop: 30, }}>

                            <Image

                                source={(profileImg !== null) ? { uri: `data:image/png;base64,${profileImg}` } : profileImage.find(v => v.name === avatarSelected).icon}
                                style={{
                                    width: 50, height: 50, borderRadius: 50,
                                }}
                            />
                            <Text style={{ color: "#FFFF", ...FONTS.h3, lineHeight: Platform.OS === 'android' ? 23 : 20, marginLeft: 10, marginRight: 40 }}>
                                {
                                    selectedProfile?.profileName
                                }
                            </Text>
                            {/* <Text style={{ color: "#FFFF", ...FONTS.body4 }}>View your Profile</Text> */}


                        </View>
                    </TouchableOpacity>
                    {/* Drawer Items */}
                    <CustomDrawerItem
                        label={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.DASHBOARD_SCREEN)}
                        icons={<DrawerDashboardIcon />}
                        onPress={() => {
                            setSelectedTab({ label: "Settings", value: "settings" });
                            navigation.navigate("MainLayoute")
                        }}
                    />
                    {/* <CustomDrawerItem
                        label={"Card Setting"}
                        icons={<DrawerCardSettingIcon />}
                        onPress={() => {
                            navigation.navigate("MainLayoute")
                        }}
                    /> */}
                    <CustomDrawerItem
                        label={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.SEND_MONEY)}
                        hasSubMenu
                        icons={<DrawerSendMoneyIcon />}
                        onPress={() => {
                            setSelectedTab({ label: t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.SEND_MONEY), value: "sendMoney" });
                            setMainDrawer(false)
                        }}
                    />

                    {/* <CustomDrawerItem
                        label={"Bills/ Recharge"}
                        hasSubMenu
                        icons={<DrawerBillsRechargeIcon />}
                        onPress={() => {
                            setSelectedTab({ label: "Bills/ Recharge", value: "bills" });
                            setMainDrawer(false)
                        }}
                    /> */}
                    <CustomDrawerItem
                        label={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.SERVICES)}
                        hasSubMenu
                        icons={<DrawerServiceIcon />}
                        onPress={() => {
                            setSelectedTab({ label: t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.SERVICES), value: "service" });
                            setMainDrawer(false)
                        }}
                    /> 
                    <CustomDrawerItem
                        label={"My Activity"}
                        hasSubMenu
                        icons={< DrawerMyActivityIcon />}
                        onPress={() => {
                            setSelectedTab({ label: "My Activity", value: "myActivity" });
                            setMainDrawer(false);
                        }}
                    />
                    {/* <CustomDrawerItem
                        label={"MyActivity"}
                        icons={<DrawerMyActivityIcon />}
                        onPress={() => {
                            navigation.navigate(HOME.MY_ACTIVITY)
                        }}
                    /> */}
                    <CustomDrawerItem
                        label={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.SETTING)}
                        hasSubMenu
                        icons={<DrawerSettingsIcon />}
                        onPress={() => {
                            setSelectedTab({ label: t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.SETTING), value: "settings" });
                            setMainDrawer(false);
                            // navigation.navigate(SETTINGS.HOME, { profileData: selectedProfile })
                        }}
                    />
                    {/* <CustomDrawerItem
                        label={"My activity"}
                        hasSubMenu
                        icons={<DrawerMyActivityIcon/>}
                        onPress={() => {
                           
                            navigation.navigate(HOME.MY_ACTIVITY)
                        }}
                    /> */}
                    <CustomDrawerItem
                        label={t(AUTH_KEYS.CALL_US.TITLE_HELP)}
                        icons={<DrawerHelpIcon />}
                        onPress={() => {
                            navigation.navigate(CALL_US)
                        }}
                    />

                    {/* <CustomDrawerItem
                        label={"Logout"}
                        icons={<DrawerLogoutIcon />}
                        onPress={() => {
                            navigation.navigate(CALL_US)
                        }}
                    /> */}

                </View>
            </DrawerContentScrollView>)
    }
    return (
        <ImageBackground
            style={{
                flex: 1,
            }}
            source={imageBackground}
        >
            <Drawer.Navigator
                headerShown={false}
                drawerType="slide"
                screenOptions={
                    {
                        drawerType: "slide",
                        drawerStyle: {
                            flex: 1,
                            width: '65%',
                            paddingRight: 20,
                            backgroundColor: 'transparent'
                        },
                        overlayColor: 'transparent',
                        sceneContainerStyle: {
                            backgroundColor: 'transparent'
                        },
                        headerShown: false
                    }

                }
                initialRouteName="MainLayoute"
                drawerContent={props => {
                    setProgress(props.progress)

                    if (mainDrawer) {
                        return (
                            <CustomDrawerContent
                                setSelectedTab={setSelectedTab}
                                navigation={props.navigation}
                            />)
                    }
                    else {
                        return (<CustomDrawerSubContent
                            subMenuList={subMenu[selectedTab.value]}
                            title={selectedTab.label}
                            navigation={props.navigation}
                        />)
                    }

                }}

            >
                <Drawer.Screen name="MainLayoute">
                    {prop =>
                        <MainHomeScreen {...prop}
                            drawerAnimationStyle={animatedStyle}
                            profiledata={profiledata.filter(v => v.isSelected === true)[0]}
                            loginResponse={loginResponse}
                        />}

                </Drawer.Screen>
            </Drawer.Navigator>
        </ImageBackground>)
}
export default CustomDrawer;
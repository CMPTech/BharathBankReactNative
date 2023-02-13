import React, { useState, useRef, useEffect, useCallback, useContext } from 'react';
import {
    ImageBackground,
    Text,
    View,
    Image,
    TouchableOpacity,
    Animated,
    Dimensions,
    BackHandler
} from 'react-native';
import ReAnimated, {
    useSharedValue, withDelay,
    withTiming,
} from "react-native-reanimated";
import { imageBackground } from '../../../assets/images';
import {
    menu,
    help,
    paybillIcon,
    myActivity,
    payPeople,
    refreshIcon,
    lagout,
    notification,
    paymentIlustrationIcon,

} from '../../../assets/icons';
import { fontName, fontSize, FONTS, SIZES, currencyValue } from "../../../styles/global.config";
import LinearGradient from 'react-native-linear-gradient';
import { AccountsTab } from '../../screens/accouts';
import { ACCOUNTS, CALL_US, GET_STARTED, PAY_PEOPLE, HOME } from '../../routes/'
import Auth from '../../api/auth';
import Accounts from '../../api/accounts';
import { showMessage, hideMessage } from "react-native-flash-message";
import { useDispatch, useSelector } from "react-redux";
import { getAccountDetailsSelector, getAccRefreshSelector, mobileNumberSelector, profileSelector, userDetailsSelector, userFirstLoginSelector } from "../../store/selectors";
import AuthBody from '../../components/base/AuthBody';
import { LoaderComponent, UserGuideComponent } from '../../components';
import DrawerLogoutIcon from '../../../assets/svg/drawer_logout.icon';
import DrawerNotificationIcon from '../../../assets/svg/drawer_notification.icon';
import PlainButton from '../../components/button/PlainButton';
import StyleTextView from '../../components/input/StyleTextView';
import { Overlay } from 'react-native-elements'
import { AppContext } from '../../../themes/AppContextProvider';
import { amountFormat, amountFormatWithoutCurrency, currencyFormat, getWholeAndDecimal } from '../../utils/amount-util';
import { DashboardUpArrowIcon, MenuHelpIcon, MenuIcon, NotificationIcon, RefreshIcon, RefreshSmallIcon, SelectUpArrowIcon } from '../../../assets/svg';
import { ProfileModel } from '../../components';
import { useTranslation } from 'react-i18next';
import { AUTH_KEYS } from '../../../assets/translations/constants';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import ShowAmountFormat from '../../components/base/ShowAmountFormat';
import moment from 'moment';
import { setRefreshAccdata } from '../../store/actions/user.action';

const MainHomeScreen = ({ drawerAnimationStyle, navigation, profiledata, loginResponse }) => {
    const allAccounts = useSelector(getAccountDetailsSelector)

    const { theme, changeTheme } = useContext(AppContext)
    const accDetailsData = useSelector(getAccountDetailsSelector);
    const dispatch = useDispatch()
    const isFocused = useIsFocused();
    const { t, i18n } = useTranslation();
    const accountModelSharedValue1 = useSharedValue(SIZES.height);
    const accountModelSharedValue2 = useSharedValue(SIZES.height);
    const accountTypes = ["CA", "SB", "OD"];
    // const [allAccounts, setAllAccount] = useState([])
    const [accountList, setAccountList] = useState([]);

    const [updateAccountList, setUpdateAccountList] = useState([]);

    const [isLoading, setLoading] = useState(false);
    const [isFirstLogin, setFirstLogin] = useState(true);
    const userFirstLogin = useSelector(userFirstLoginSelector)
    const mobileNumberInApp = useSelector(mobileNumberSelector)
    const accDataRefresh = useSelector(getAccRefreshSelector)


    const selectedUserData = useSelector(userDetailsSelector)

    const { height } = Dimensions.get('window');

    const profileModelSharedValue1 = useSharedValue(SIZES.height * 0.1);
    const profileModelSharedValue2 = useSharedValue(SIZES.height * 0.1);

    React.useEffect(() => {
        // console.log('Trigger')
        setAccountList(allAccounts.filter(v => accountTypes.indexOf(v.acctType) > -1))
    }, [allAccounts])

    const callProfileView = useCallback(() => {
        profileModelSharedValue1.value = withTiming(
            0, { duration: 300 }
        )
        profileModelSharedValue2.value = withDelay(3000, withTiming(0, { duration: 1000 }))

        setTimeout(function () {
            profileModelSharedValue2.value = withTiming(SIZES.height, { duration: 500 })
            profileModelSharedValue1.value = withDelay(5000, withTiming(SIZES.height, { duration: 100 }))
        }, 3000);
    }, [])




    const showProfileDataView = useCallback(() => {
        showMessage({
            message: "",
            type: "danger",
            hideStatusBar: true,
            backgroundColor: "white", // background color
            color: "grey", // text color,
            renderCustomContent: () => {

                const date = new Date(loginResponse?.lastLoginTime);

                return (
                    <View style={{ marginBottom: -20 }}>
                        <Text style={{ color: theme.colors.grey, ...FONTS.body5, }}>
                            {t(AUTH_KEYS.WEL_COME.WELCOME_BACK)}
                        </Text>
                        <Text style={{ color: theme.colors.grey, ...FONTS.h2, marginTop: 5 }}>
                            {selectedUserData?.customerName}
                        </Text>
                        <Text style={{ color: '#455362', fontSize: 10, fontFamily: fontName.regular, marginTop: 10, }}>
                            {/* {t(AUTH_KEYS.WEL_COME.LAST_LOGIN) + (date ? moment(date).format('DD-MMM-YYYY hh:MM:ss A') : "")} */}
                            {t(AUTH_KEYS.WEL_COME.LAST_LOGIN) + (date ? loginResponse?.lastLoginTime : "")}
                        </Text>

                        <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center', marginTop: 20, marginBottom: 5 }}>
                            <DashboardUpArrowIcon />
                        </View>

                    </View>
                )
            },
        });
    }, [])

    // useEffect(() => {
    //     getAllAccountDetails()
    // }, []);

    React.useEffect(() => {

        getAllAccountDetails()



        // const willFocusSubscription = navigation.addListener('focus', () => {


        //     console.log("accDataRefresh")
        //     console.log(accDataRefresh)
        //     if (accDataRefresh) {
        //         getAllAccountDetails()
        //         dispatch(setRefreshAccdata(false))
        //     }


        // });

        // return willFocusSubscription;
    }, []);

    const backPressHandler = useCallback(() => {
        if (isFocused) {
            setShowConfirmAlert(true)
        }
        return true
    }, [navigation])

    const useBackHandler = (backHandler) => {
        useFocusEffect(() => {
            const subscription = BackHandler.addEventListener(
                'hardwareBackPress',
                backHandler
            )
            return () => subscription.remove()
        })
    }
    useBackHandler(backPressHandler)
    const [showConfirmAlert, setShowConfirmAlert] = useState(false)



    const logoutService = useCallback(async () => {
        try {
            setLoading(true);
            const response = await Auth.logoutApi();
            setLoading(false);
            showMessage({
                message: t(AUTH_KEYS.WEL_COME.LOGOUT),
                description: response.message,
                type: "success",
                hideStatusBar: true,
                backgroundColor: "black", // background color
                color: "white", // text color
            });

            navigation.navigate(GET_STARTED)
        } catch (error) {
            setLoading(false);
            showMessage({
                message: t(AUTH_KEYS.WEL_COME.LOGOUT),
                description: error.message || error.error,
                type: "danger",
                hideStatusBar: true,
                backgroundColor: "black", // background color
                color: "white", // text color
            });
            navigation.navigate(GET_STARTED)
        }
    },
        [navigation]
    );


    const confirmAlertUI = (values) => {

        return (
            <Overlay
                isVisible={showConfirmAlert}
                onBackdropPress={() => setShowConfirmAlert(!showConfirmAlert)}
                height='auto'
                overlayStyle={{
                    color: theme.colors.mainBackground1,
                    width: '90%'
                }}>


                <View style={{ padding: 15 }}>
                    <StyleTextView value={t(AUTH_KEYS.MAIN_SCREEN.LOGOUT_TITLE)} style={{
                        fontSize: fontSize.textLarge,
                        fontFamily: fontName.medium,
                        color: theme.colors.textColor,
                        marginTop: 10,
                    }} />

                    <StyleTextView value={t(AUTH_KEYS.MAIN_SCREEN.LOGOUT_MSG)} style={{
                        fontSize: fontSize.textNormal,
                        fontFamily: fontName.regular,
                        lineHeight: 20,
                        color: theme.colors.textColor,
                        paddingBottom: 20,
                        marginTop: 30,
                    }} />



                    <View style={{ flexDirection: 'row', paddingTop: 20, alignSelf: 'flex-end', marginRight: 30 }}>
                        <PlainButton
                            style={{ marginRight: '30%', color: theme.colors.black, fontFamily: fontName.medium }}
                            title={t(AUTH_KEYS.LOCATE_US.CANCEL)} onPress={() => {
                                setShowConfirmAlert(!showConfirmAlert)
                            }
                            } />

                        <PlainButton title={t(AUTH_KEYS.LOCATE_US.OK)}
                            style={{ fontFamily: fontName.medium }}
                            onPress={() => {
                                setShowConfirmAlert(!showConfirmAlert)
                                logoutService()
                            }
                            } />
                    </View>


                </View>
            </Overlay>
        );
    }

    const updateAllAccountDetails = useCallback(async () => {
        try {
            let request = {
                userName: mobileNumberInApp || "",
                profileId: profiledata.profileId,
            }
            setLoading(true);
            const response = await Accounts.getAllAccountDetailsApi(request);
            setLoading(false);
            // setAllAccount(response.custAccDetails)
            setAccountList(response.custAccDetails.filter(v => accountTypes.indexOf(v.acctType) > -1))

        } catch (error) {
            setLoading(false);
            showMessage({
                message: t(AUTH_KEYS.LOCATE_US.ERROR_MSG),
                description: error.message || error.error,
                type: "danger",
                hideStatusBar: true,
                backgroundColor: "black", // background color
                color: "white", // text color
            });
        }
    },
        [navigation]
    );

    const getAllAccountDetails = useCallback(async () => {

        try {
            let request = {
                userName: mobileNumberInApp || "",
                profileId: profiledata.profileId,
            }
            setLoading(true);
            const response = await Accounts.getAllAccountDetailsApi(request);
            setLoading(false);
            // setAllAccount(response.custAccDetails)
            setAccountList(response.custAccDetails.filter(v => accountTypes.indexOf(v.acctType) > -1))

            //callProfileView();
            showProfileDataView()
        } catch (error) {
            setLoading(false);
            showMessage({
                message: t(AUTH_KEYS.LOCATE_US.ERROR_MSG),
                description: error.message || error.error,
                type: "danger",
                hideStatusBar: true,
                backgroundColor: "black", // background color
                color: "white", // text color
            });
        }
    },
        [navigation]
    );
    const scrollX = useRef(new Animated.Value(0)).current;
    const header = () => {
        return (<View style={{ flexDirection: 'row', alignItems: 'center', margin: 10, paddingTop: 10, overflow: 'hidden' }}>
            <View style={{ position: 'absolute', left: 0, zIndex: 1, paddingTop: 10, flexDirection: 'row', overflow: 'hidden' }}>
                <TouchableOpacity onPress={() => {
                    navigation.toggleDrawer();
                }}>
                    <Image
                        source={menu}
                        style={{ width: 25, height: 25, tintColor: '#00ffce' }}
                    />
                </TouchableOpacity>


            </View>

            {/* <View style={{ position: 'absolute', right: 0, left: 0, paddingTop: 10 }}>
                <Text style={{ ...FONTS.body2, color: '#FFF', textAlign: 'center', alignSelf: 'center' }}>
                    Dashboard
                </Text>
            </View> */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', position: 'absolute', right: 0, paddingTop: 10 }}>

                <TouchableOpacity
                    style={{ marginLeft: 20 }}
                    onPress={() => {

                    }}>
                    <Image
                        source={help}
                        style={{ width: 25, height: 25 }}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={{ marginLeft: 20 }}
                    onPress={() => {

                    }}>
                    <Image
                        source={notification}
                        style={{ width: 25, height: 25, tintColor: '#00ffce' }}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={{ marginLeft: 20 }}
                    onPress={() => {
                        navigation.navigate(GET_STARTED)
                    }}>
                    <Image
                        source={lagout}
                        style={{ width: 25, height: 25, tintColor: '#00ffce' }}
                    />
                </TouchableOpacity>
            </View>

        </View>)
    }
    const renderItem = ({ item, index }) => {

        return (
            <TouchableOpacity
                style={{ width: SIZES.width, justifyContent: 'center', alignItems: 'center', marginTop: 30, }}
                onPress={() => {
                    navigation.navigate(ACCOUNTS.ACCOUNT_SUMMERY, { accountItem: item });

                }}
            >
                <Text style={{ ...FONTS.body4, color: '#FFFF', padding: 2 }}>{t(AUTH_KEYS.MAIN_SCREEN.AVAILABLE_BALANCE)}</Text>
                <TouchableOpacity
                    style={{ padding: 2, flexDirection: 'row', alignItems: 'center', marginTop: 5 }}
                    onPress={() => {
                        const dummyData = accountList;
                        let arr = dummyData.map((items, ind) => {
                            items.showBalance = true
                            return { ...items }
                        })
                        setAccountList(arr)
                    }}
                >

                    {!item.showBalance &&
                        // <Image
                        //     source={refreshIcon}
                        //     style={{ width: 20, height: 20, tintColor: theme.colors.buttonColor, margin: 5, }}
                        // />
                        <RefreshIcon color={theme.colors.lightGreen} />
                    }



                    {item.showBalance
                        ?
                        // <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                        //     <Text style={{ ...FONTS.body1, color: '#FFFF', fontSize: 20, marginRight: 5, paddingBottom: 5 }}>
                        //         {currencyValue[item.acctCcy]}
                        //     </Text>
                        //     <Text style={{ ...FONTS.body1, color: '#FFFF', fontSize: 35, }}>
                        //         {/* {amountFormatWithoutCurrency(item.availableBalance, item.acctCcy)} */}

                        //         {amountFormatWithoutCurrency(getWholeAndDecimal(item.availableBalance)[0])}
                        //     </Text>
                        //     <Text style={{ ...FONTS.body1, color: '#FFFF', fontSize: 20, paddingBottom: 5 }}>
                        //         {/* {amountFormatWithoutCurrency(item.availableBalance, item.acctCcy)} */}
                        //         {"." + getWholeAndDecimal(item.availableBalance)[1]}
                        //     </Text>
                        // </View>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate(ACCOUNTS.ACCOUNT_SUMMERY, { accountItem: item });
                                }}
                            >
                                <ShowAmountFormat currency={item.acctCcy} amount={item.availableBalance} />

                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{ marginLeft: 5 }}
                                onPress={() => {
                                    updateAllAccountDetails()
                                }}
                            >
                                <RefreshSmallIcon color={theme.colors.lightGreen} size={20} />
                            </TouchableOpacity>
                        </View>

                        :
                        <Text style={{ ...FONTS.body3, color: theme.colors.lightGreen, marginLeft: 5 }}>{t(AUTH_KEYS.MAIN_SCREEN.VIEW_BALANCE)}</Text>}
                </TouchableOpacity>
                {/* <Text style={{ ...FONTS.h3, color: '#FFFF', padding: 2 }}>{`${item.acctType}  ${item.acctNo}`}</Text> */}
                {/* {item.showBalance ? <Text style={{ ...FONTS.body5, color: '#FFFF', padding: 2 }}>{`as on ${new Date().toDateString()} ${new Date().toLocaleTimeString()}`}</Text> : null} */}
                {item.showBalance &&
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate(ACCOUNTS.VIEW_E_PASS_BOOK, { accountItem: item });

                        }}
                    >
                        <Text style={{ ...FONTS.h3, color: '#FFFF', padding: 2 }}>{t(AUTH_KEYS.MAIN_SCREEN.VIEW_STATEMENT)}</Text>
                    </TouchableOpacity>
                }

                <View style={{ justifyContent: 'space-between', flexDirection: 'row', width: '90%', marginTop: 10, alignItems: 'center' }}>
                    <TouchableOpacity
                        style={{ width: "45%" }}
                        onPress={() => {
                            navigation.navigate(ACCOUNTS.ACCOUNT_SUMMERY, { accountItem: item });

                        }}
                    >
                        <Text style={{ ...FONTS.body4, color: '#FFFF', padding: 2, textTransform: 'capitalize' }}>{item.acctShortName}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ width: "45%" }}
                        onPress={() => {
                            navigation.navigate(ACCOUNTS.ACCOUNT_SUMMERY, { accountItem: item });

                        }}
                    >
                        <Text style={{ ...FONTS.body4, color: '#FFFF', padding: 2 }}>{item.acctType + " " + item.acctNo}</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>)
    }
    const Dots = () => {
        const dotPosition = Animated.divide(scrollX, SIZES.width)
        return (<View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 10,
            justifyContent: 'center'
        }}>
            {accountList.map((item, index) => {
                const dotOpacity = dotPosition.interpolate({
                    inputRange: [index - 1, index, index + 1],
                    outputRange: [0.5, 1, 0.5],
                    extrapolate: 'clamp'
                })
                return (
                    <Animated.View
                        key={`dot-${index}`}
                        style={{
                            borderRadius: 5,
                            marginHorizontal: 6,
                            width: 8,
                            height: 8,
                            opacity: dotOpacity,
                            backgroundColor: '#FFFF',
                        }}
                    />
                )
            })

            }
        </View>)
    }



    return (
        //<AuthBody
        //     title={"Register"}
        //     hideHeader={true}
        //     isLoading={isLoading}
        //     navigation={navigation}>

        <ReAnimated.View
            style={{
                flex: 1,
                height: height,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
                ...drawerAnimationStyle,
            }}
        >


            <ImageBackground
                source={imageBackground}
                resizeMode={'cover'}
                style={{
                    flex: 1,
                    width: '100%'
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10, paddingTop: 10, overflow: 'hidden' }}>
                    <View style={{ zIndex: 1, flexDirection: 'row', overflow: 'hidden' }}>
                        <TouchableOpacity onPress={() => {
                            navigation.toggleDrawer();
                        }}>
                            {/* <Image
                                source={menu}
                                style={{ width: 25, height: 25, tintColor: '#00ffce' }}
                            /> */}
                            <MenuIcon />
                        </TouchableOpacity>


                    </View>

                    {/* <View style={{ position: 'absolute', right: 0, left: 0, paddingTop: 10 }}>
                        <Text style={{ ...FONTS.body2, color: '#FFF', textAlign: 'center', alignSelf: 'center' }}>
                            Dashboard
                        </Text>
                    </View> */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', position: 'absolute', right: 0, paddingTop: 10 }}>

                        <TouchableOpacity
                            style={{ marginLeft: 20 }}
                            onPress={() => {
                                navigation.navigate(CALL_US)
                            }}>
                            {/* <Image
                                source={help}
                                style={{ width: 25, height: 25 }}
                            /> */}
                            <MenuHelpIcon />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginLeft: 20 }}
                            onPress={() => {
                                navigation.navigate(HOME.NOTIFICATION)
                            }} >
                            {/* <Image
                                source={notification}
                                style={{ width: 25, height: 25, tintColor: '#00ffce' }}
                            /> */}
                            <NotificationIcon />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginLeft: 20 }}
                            onPress={() => {
                                //logoutService()
                                setShowConfirmAlert(true)
                            }}>
                            {/* <Image
                                source={lagout}
                                style={{ width: 25, height: 25, tintColor: '#00ffce' }}
                            /> */}
                            <DrawerLogoutIcon color1={'#00ffce'} />
                        </TouchableOpacity>
                    </View>

                </View>

                {confirmAlertUI()}

                <View style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 60 }}>
                    {/* Accounts Balance */}
                    <Animated.FlatList
                        // ref={flatListRef}
                        data={accountList}
                        extraData={updateAccountList && accountList}
                        pagingEnabled
                        horizontal
                        snapToAlignment='center'
                        snapToInterval={SIZES.width}
                        decelerationRate='fast'
                        scrollEventThrottle={16}
                        disableIntervalMomentum={true}
                        showsHorizontalScrollIndicator={false}
                        onScroll={Animated.event([
                            {
                                nativeEvent: {
                                    contentOffset: { x: scrollX }
                                }
                            }
                        ], {
                            useNativeDriver: false
                        })}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => `${index}`}
                    />
                    {/* Dots  */}
                    <Dots />
                </View>

                <View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
                    {/* Pay people and Pay bills Buttons  */}

                    <View style={{ justifyContent: 'center', flexDirection: 'row', marginTop: 10, top: -40, alignItems: 'center', width: SIZES.width }}>
                        <TouchableOpacity
                            activeOpacity={1}
                            style={{
                                overflow: 'visible',
                                flexDirection: 'row',
                                padding: 15,
                                backgroundColor: '#FFFF',
                                borderBottomLeftRadius: 5,
                                borderTopLeftRadius: 5,
                                width: '45%',
                                elevation: 5,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 0 },
                                shadowOpacity: 0.1,
                                shadowRadius: 3,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onPress={() => {
                                navigation.navigate(PAY_PEOPLE.MENU)
                            }}
                        >
                            <Image
                                source={payPeople}
                                style={{ width: 20, height: 25, tintColor: theme.colors.buttonColor, margin: 5 }}
                            />
                            <Text style={{ ...FONTS.h2, color: theme.colors.buttonColor, textAlign: 'center', margin: 5, fontFamily: fontName.medium, paddingLeft: 10 }}>{t(AUTH_KEYS.PAY_PEOPLE.PAYEE_PEOPLE)}</Text>

                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={1}


                            style={{
                                padding: 15,
                                backgroundColor: '#FFFF',
                                borderBottomRightRadius: 5,
                                borderTopRightRadius: 5,
                                width: '45%',
                                elevation: 5,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 0 },
                                shadowOpacity: 0.1,
                                shadowRadius: 3,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onPress={() => {
                                navigation.navigate(HOME.PAY_BILLS)
                            }}
                        >
                            <Image
                                source={paybillIcon}
                                style={{ width: 20, height: 25, tintColor: theme.colors.buttonColor, margin: 5 }}
                            />
                            <Text style={{ ...FONTS.h2, color: theme.colors.buttonColor, margin: 5, fontFamily: fontName.medium, paddingLeft: 10 }}>{t(AUTH_KEYS.PAY_PEOPLE.PAY_BILLS)}</Text>
                        </TouchableOpacity>

                    </View>
                    {/* Payment OverView */}
                    <Text style={{ ...FONTS.h2, marginBottom: 20, marginHorizontal: 20, color: theme.colors.grey, }}>{t(AUTH_KEYS.MAIN_SCREEN.PAYMENT_OVERVIEW)}</Text>
                    <View >


                        <Image
                            source={paymentIlustrationIcon}
                            style={{ width: 60, height: 60, justifyContent: 'center', alignSelf: 'center' }}
                        />

                        <Text style={{ ...FONTS.body3, textAlign: 'center', color: theme.colors.textColor, marginVertical: 15 }}>{t(AUTH_KEYS.MAIN_SCREEN.PAYMENT_OVERVIEW_MSG)}</Text>
                        {/* <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 10 }}>
                       
                        <Text style={{ ...FONTS.h4, opacity: 0.8, textAlign: 'center', color: '#2196f3', opacity: 0.8 }}>Get bills and Payments</Text>
                    </TouchableOpacity> */}
                    </View>
                    {/* My Account Button */}
                    <TouchableOpacity
                        onPress={() => {

                            navigation.navigate(ACCOUNTS.ACCOUNTS_OVERVIEW, { accountList: allAccounts })
                            // accountModelSharedValue1.value = withTiming(
                            //     0, { duration: 100 }
                            // )
                            // accountModelSharedValue2.value = withDelay(100, withTiming(0, { duration: 500 }))
                        }}
                        style={{ position: 'absolute', alignSelf: 'center', bottom: 10 }}
                    >
                        <LinearGradient
                            useAngle={true}
                            angle={135}
                            style={{ width: SIZES.width * 0.9, backgroundColor: '#2196f3', padding: 15, alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}
                            angleCenter={{ x: 0.5, y: 0.5 }}
                            colors={["#4370e7", "#4370e7", "#4ad4e8"]} >

                            <Text style={{ ...FONTS.h3, color: theme.colors.white }}>{t(AUTH_KEYS.MAIN_SCREEN.ACCOUNT_OVERVIEW)}</Text>
                        </LinearGradient>

                    </TouchableOpacity>

                </View>
            </ImageBackground>
            {/* <AccountsTab
                accountModelSharedValue1={accountModelSharedValue1}
                accountModelSharedValue2={accountModelSharedValue2}
                accountList={allAccounts}
                navigation={navigation}
            /> */}

            {/* <ProfileModel
                profileModelSharedValue1={profileModelSharedValue1}
                profileModelSharedValue2={profileModelSharedValue1}
            /> */}





            {/* <View style={{margin:10}}>
                        <Text style={{ color: theme.colors.grey, ...FONTS.body5, marginTop: 10 }}>
                            Welcome back!
                        </Text>
                        <Text style={{ color: theme.colors.grey, ...FONTS.h2, marginTop: 5 }}>
                        { selectedProfileDetails?.profileName}
                        </Text>
                        <Text style={{ color: '#455362', fontSize: 10, fontFamily: fontName.regular, marginTop: 10 ,paddingBottom:20}}>
                            {" Last login: " + new Date().toLocaleString()}
                        </Text>
                        
                    </View> */}
            {isLoading && <LoaderComponent />}
            {userFirstLogin && <UserGuideComponent />}
        </ReAnimated.View>

        // </AuthBody>
    )
}

export default MainHomeScreen;
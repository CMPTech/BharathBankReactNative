import React, { useContext, useEffect, useState, useCallback } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButtonIcon, DashboardAccountsIcon, DashboardDepositsIcon, DashboardExchangeRatesIcon, DashboardLoansIcon, DashboardLogoutIcon, DashboardOffersIcon, DashboardOthersIcon, DashboardPaymentsIcon, DashboardPortfolioIcon, DashboardTransfersIcon, Logo, ProfileImageIcon } from "../../../assets/svg";
import SideMenuIcon from "../../../assets/svg/side-menu.icon";
import { colors, fontName, fontSize } from "../../../styles/global.config";
import { AppContext } from "../../../themes/AppContextProvider";
import Home from "../../api/dashboard";
import { AUTH, HOME } from "../../routes";
import { store } from "../../store";
import Toast from "react-native-toast-message";
import { Overlay } from 'react-native-elements'
import StyleTextView from "../input/StyleTextView";
import DashboardHomeIcon from "../../../assets/svg/dashboard-home.icon";

export default function HomeHeader({ children, title, navigation, isMainPage }) {

    const { theme, changeTheme } = useContext(AppContext)
    const { user } = store.getState();

    const [image, setImage] = useState(user.profile.imageData || null)

    const [navDraw, setNavDraw] = useState(false)

    const getProfileImage = useCallback(
        async () => {
            try {
                const response = await Home.getProfileImageApi();
                setImage(response.imageData)

            } catch (error) {
                Toast.show({
                    type: "error",
                    text1: "Error",
                    text2: error.message,
                });
            }
        },
        [navigation]
    );


    function renderDetails(value, naviPath, isLogout, icon) {

        return (
            <TouchableOpacity
                onPress={() => {
                    setNavDraw(!navDraw)

                    !isLogout ? navigation.navigate(naviPath) :
                        navigation.reset({
                            index: 0,
                            routes: [{ name: AUTH.LOGIN }],
                        })
                }}>

                <View style={{ padding: 10 ,marginTop:10}}>

                    <View style={{
                        width: '100%',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        {icon || <DashboardHomeIcon />}
                        <StyleTextView value={(value)}
                            style={{
                                fontSize: fontSize.textNormal,
                                fontFamily: fontName.bold,
                                color: theme.colors.headingTextColor,
                                paddingLeft: 10
                            }} />
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    useEffect(() => {
        if (image == null || image <= 0) {
            getProfileImage()
        }

    }, [])

    return (
        <View style={{
            flexDirection: 'row',
            alignContent: 'center',
            alignItems: 'center',
            padding: 20,
            backgroundColor: theme.colors.mainBackground2,
        }}>

            {!isMainPage ?
                <TouchableOpacity
                    onPress={() => navigation.goBack()}>
                    <BackButtonIcon color={theme.colors.headingTextColor} />
                </TouchableOpacity>
                :
                <TouchableOpacity
                    onPress={() => { setNavDraw(!navDraw) }
                        //     navigation.reset({
                        //     index: 0,
                        //     routes: [{ name: AUTH.LOGIN }],
                        // })
                        //navigation.toggleDrawer()
                    }

                >
                    <SideMenuIcon color={theme.colors.headingTextColor} />
                </TouchableOpacity>
            }

            <Overlay
                isVisible={navDraw}
                animationType="fade"
                onBackdropPress={() => setNavDraw(!navDraw)}
                overlayStyle={{
                    color: theme.colors.mainBackground1,
                    opacity: 1.9,
                    width: '80%',
                    justifyContent: 'flex-start',
                    alignSelf: 'flex-start',
                    height: '100%',
                    backgroundColor: theme.colors.mainBackground1
                }}>
                <ScrollView>
                    <View style={{ marginTop: 20, marginLeft: 10 }}>
                        {renderDetails("Home", HOME.DASHBOARD, false, <DashboardHomeIcon />)}
                        {renderDetails("Accounts", HOME.ACCOUNTS, false, <DashboardAccountsIcon />)}
                        {renderDetails("Portfolio", HOME.PORTFOLIO, false, <DashboardPortfolioIcon />)}
                        {renderDetails("Transfers", HOME.TRANSFER, false, <DashboardTransfersIcon />)}
                        {renderDetails("Payments", HOME.PAYMENTS, false, <DashboardPaymentsIcon />)}
                        {renderDetails("Deposits", HOME.DOPOSITS, false, <DashboardDepositsIcon />)}
                        {renderDetails("Loans", HOME.LOAN_SCREEN, false, <DashboardLoansIcon />)}
                        {renderDetails("Exchange Rates", HOME.EXCHANGE_RATE, false, <DashboardExchangeRatesIcon />)}
                        {renderDetails("Other Services", HOME.OTHERS, false, <DashboardOthersIcon />)}

                        <View style={{ marginTop: 15, width: '95%' }}>
                            <DashboardOffersIcon />
                        </View>
                    </View>
                </ScrollView>
            </Overlay>
            <View style={{ flex: 1, alignItems: 'center', marginRight: 40 }}>
                <Text style={{
                    marginLeft: 10,
                    color: theme.colors.headingTextColor,
                    fontSize: 20,
                    fontFamily: fontName.bold,
                }}>{title ? title : "Dashboard"}</Text>
            </View>


            <View style={{ position: 'absolute', right: 0, paddingRight: 20 }}>
                <TouchableOpacity
                    onPress={() => navigation.navigate(HOME.PROFILE)}>

                    {/* <ProfileImageIcon /> */}
                    {image && image.length > 0 ?
                        <Image
                            source={{ uri: `data:image/png;base64,${image}` }}
                            style={{
                                height: 40,
                                borderRadius: 30,
                                alignSelf: 'center',
                                aspectRatio: 1,
                                backgroundColor: '#878787'
                            }}
                        />
                        :
                        <ProfileImageIcon />
                    }
                </TouchableOpacity>
            </View>

        </View>
    );
}


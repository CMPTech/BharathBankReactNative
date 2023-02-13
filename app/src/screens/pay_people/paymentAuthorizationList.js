import React, { useContext, useEffect, useState, useCallback } from "react";
import { SafeAreaView, View, ScrollView, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import {
    settingMenu
} from '../../../assets/icons'
import { LoaderComponent, BottomButton, AlerComponent, AuthHeader, MainButton } from '../../components';
import { AppContext } from "../../../themes/AppContextProvider";
import StyleTextView from '../../components/input/StyleTextView';
import { fontName, fontSize, FONTS, SIZES, currencyValue, colors } from "../../../styles/global.config";
import { amountFormat } from '../../utils/amount-util'
import { PAY_PEOPLE } from "../../routes";
import Home from '../../api/dashboard';
import { showMessage } from "react-native-flash-message";
import { useSelector } from 'react-redux';
import { profileSelector } from '../../store/selectors';
import moment from 'moment/moment';
import { t } from "i18next";
import { AUTH_KEYS } from "../../../assets/translations/constants";
const AuthoriztaionList = ({ navigation }) => {
    const [isLoading, setLoading] = useState(false);
    const { theme, changeTheme } = useContext(AppContext);
    const selectedProfileDetails = useSelector(profileSelector);
    const [page, setPage] = useState(0)
    const [authList, setAuthList] = useState([]);
    const [hasNext, setHasNext] = useState(true);
    const statusType = {
        "P": "Pending",
        "R": "Approved",
        "R": "Rejected",
        "V": "Pending",
        "RN": "Return"
    }
    useEffect(() => {
        getPaymentList();
        navigation.addListener('willFocus', () => {
            loadPaymentList();
        });
    }, [])
    const loadPaymentList = useCallback(async () => {
        try {

            let request = {
                "profileId": selectedProfileDetails.profileId,
                "page": page,
                "size": 10


            };
            setLoading(true);
            const response = await Home.getPaymentListApi(request);
            setAuthList(response.transferRecords);
            setHasNext(response.hasNext);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            showMessage({
                message: "",
                description: error.message || error.error,
                type: "danger",
                hideStatusBar: true,
                backgroundColor: "black", // background color
                color: "white", // text color
            });
        }
    },
        [navigation, authList]
    );
    const getPaymentList = useCallback(async () => {
        try {
            if (hasNext) {
                let request = {
                    "profileId": selectedProfileDetails.profileId,
                    "page": page,
                    "size": 10


                };
                setLoading(true);
                const response = await Home.getPaymentListApi(request);
                setAuthList([...authList, ...response.transferRecords]);
                setHasNext(response.hasNext);
                setPage(page + 1)
                setLoading(false);
            }


        } catch (error) {
            setLoading(false);
            showMessage({
                message: "",
                description: error.message || error.error,
                type: "danger",
                hideStatusBar: true,
                backgroundColor: "black", // background color
                color: "white", // text color
            });
        }
    },
        [navigation, page, hasNext, authList]
    );
    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                style={{ backgroundColor: theme.colors.white, margin: 10, borderRadius: 5, padding: 10 }}
                onPress={() => {
                    navigation.navigate(PAY_PEOPLE.AUTHORISATION_DETAIL, { ...item, pendingItem: '' })
                }}
            >
                <StyleTextView value={`${'Payment to '} ${item.payeeName}`}
                    style={{
                        fontSize: fontSize.textSmall,
                        fontFamily: fontName.medium,
                        color: theme.colors.grey,
                        paddingTop: 5,

                    }} />
                <StyleTextView value={`${amountFormat(item.amount)}`}
                    style={{
                        fontSize: fontSize.textLarge,
                        fontFamily: fontName.medium,
                        paddingTop: 5,
                        color: theme.colors.headingTextColor,

                    }} />
                <View style={{ flexDirection: 'row', width: '80%' }}>
                    <StyleTextView value={`${'Initiated by '} ${item.initiatorName} ${'|'} `}
                        style={{
                            fontSize: fontSize.textSmall,
                            fontFamily: fontName.medium,
                            color: theme.colors.grey,
                            paddingTop: 5,
                           width: '90%'

                        }} />
                    <StyleTextView value={`${'Priority '} - ${item.priority}`}
                        style={{
                            fontSize: fontSize.textSmall,
                            fontFamily: fontName.medium,
                            paddingTop: 5,
                            color: theme.colors.pinkColor,

                        }} />
                </View>
                {item.status === "P"
                    && (<StyleTextView value={` ${statusType[item.status]}`}
                        style={{
                            fontSize: fontSize.textSmall,
                            fontFamily: fontName.bold,
                            paddingTop: 5,
                            color: item.status === "P" ? theme.colors.orangeColor : item.status === "A" ? theme.colors.green : theme.colors.buttonColor,

                        }} />)
                }
                {item.authorizerRemarks !== null ? item.authorizerRemarks.split("~").filter(v => v !== 'null').map(v => {
                    return (
                        <StyleTextView value={`${v}`}
                            style={{
                                fontSize: fontSize.textSmall,
                                fontFamily: fontName.bold,
                                paddingTop: 5,
                                color: theme.colors.green,

                            }} />
                    )
                }) : null}


            </TouchableOpacity>)
    }
    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const paddingToBottom = 90; //Distance from the bottom you want it to trigger.
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom;
    };
    return (<SafeAreaView
        style={{
            flex: 1,
        }}
    >
        <View style={{
            flex: 1,
        }}>
            <AuthHeader
                title={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.AUTHORIZATION_LIST)}
                navigation={navigation}
            />
            <TouchableOpacity
                style={{ position: 'absolute', top: 10, right: 10 }}
            >
                <Image
                    source={settingMenu}
                    style={{ width: 20, height: 25, position: 'absolute', top: 10, right: 10, tintColor: theme.colors.white }}
                />
            </TouchableOpacity>


            <FlatList
                data={authList}
                extraData={authList}
                ListHeaderComponent={() => {
                    if (authList.filter(v => v.status == "P").length > 0) {
                        return (<StyleTextView value={authList.filter(v => v.status == "P").length > 0 ? `You have  ${authList.filter(v => v.status == "P").length} pending payments for authorization today` : ``}
                            style={{
                                fontSize: fontSize.textLarge,
                                fontFamily: fontName.medium,
                                textAlign: 'center',
                                margin: 20,
                                color: theme.colors.headingTextColor,

                            }} />)
                    }
                    return null

                }}
                ListEmptyComponent={() => {
                    return (<StyleTextView value={t(AUTH_KEYS.MAIN_SCREEN.NO_RECORD_FOUND)}
                        style={{
                            fontSize: fontSize.textLarge,
                            fontFamily: fontName.medium,
                            textAlign: 'center',
                            margin: 20,
                            color: theme.colors.headingTextColor,

                        }} />)
                }}
                renderItem={renderItem}
                onScroll={({ nativeEvent }) => {
                    if (isCloseToBottom(nativeEvent)) {
                        if (hasNext) {
                            getPaymentList();

                        }
                    }
                }}
                scrollEventThrottle={1000}
            />
        </View>
        {isLoading && <LoaderComponent />}
    </SafeAreaView>)
}
export default AuthoriztaionList;
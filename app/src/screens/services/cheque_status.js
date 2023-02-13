import React, { useContext, useEffect, useState, useCallback } from "react";
import { SafeAreaView, View, TouchableOpacity, Image, FlatList } from 'react-native';
import {
    settingMenu, rightArrow
} from '../../../assets/icons'
import { LoaderComponent, AccountDropDownView, AlerComponent, AuthHeader, MainButton } from '../../components';
import { AppContext } from "../../../themes/AppContextProvider";
import StyleTextView from '../../components/input/StyleTextView';
import { fontName, fontSize, FONTS, SIZES, currencyValue, colors } from "../../../styles/global.config";
import Services from '../../api/Services'
import { showMessage } from "react-native-flash-message";
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AUTH_KEYS } from '../../../assets/translations/constants';
import { profileSelector, getAccountDetailsSelector } from '../../store/selectors';
import LinearGradient from 'react-native-linear-gradient';
import { BackIcon, } from '../../../assets/svg';
const ChequeStatus = ({ navigation, route }) => {
    const { params } = route;
    const { t, i18n } = useTranslation();
    const [isLoading, setLoading] = useState(false);
    const accDetailsData = useSelector(getAccountDetailsSelector);
    const { theme, changeTheme } = useContext(AppContext);
    const selectedProfileDetails = useSelector(profileSelector);
    const [page, setPage] = useState(0)
    const [chequeList, setChequeList] = useState([]);
    const [hasNext, setHasNext] = useState(true);
    const statusType = {
        "P": "Paid",
        "S": "Stopped",
        "D": "Destroyed",
        "R": "Return paid",
        "C": "Cautioned",
        "I": "Issued but not acknowledged",
        "U": "Unused"
    }
    useEffect(() => {
        loadChequeList(accDetailsData.find(v => v.primaryAccount === true).acctNo)
    }, [])
    const loadChequeList = useCallback(async (account) => {
        try {

            let request = {
                "accountNo": params.srcAccount,
                "beginChqNo": params.beginCheque,
                "branchId": params.brnCode,
                "noOfCheques": params.numberOfLeaves
            };
            setLoading(true);
            const response = await Services.getChequeStatusApi(request);
            setChequeList(response);
            // setHasNext(response.hasNext);
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
        [navigation, chequeList]
    );

    const renderItem = ({ item, index }) => {
        return (
            <>
                <TouchableOpacity
                    activeOpacity={1}
                    style={{ backgroundColor: theme.colors.white, flexDirection: 'row', borderRadius: 5, padding: 10, paddingHorizontal: 20 }}
                >
                    <View style={{ width: '90%' }}>
                        <StyleTextView value={`${t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.CHEQUE_NO)} ${item.chequeNo}`}
                            style={{
                                fontSize: fontSize.textLarge,
                                fontFamily: fontName.medium,
                                color: theme.colors.headingTextColor,
                                paddingTop: 5,

                            }} />
                        <StyleTextView value={`${item.chequeStatus}`}
                            style={{
                                fontSize: fontSize.textNormal,
                                fontFamily: fontName.medium,
                                paddingTop: 5,
                                color: theme.colors.textColor,

                            }} />
                        {/* <StyleTextView value={`${'Issued on'}  ${item.issueDate} `}
                            style={{
                                fontSize: fontSize.textSmall,
                                fontFamily: fontName.medium,
                                paddingTop: 5,
                                color: theme.colors.grey,

                            }} /> */}
                    </View>
                </TouchableOpacity>
                <View style={{ height: 0.5, opacity: 0.5, backgroundColor: colors.dividerColor }} />
            </>
        )
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
        <FlatList
            data={chequeList}
            extraData={chequeList}
            ListHeaderComponent={() => {
                if (chequeList.length > 0) {
                    return (
                        <LinearGradient
                            useAngle={true}
                            angle={170}
                            angleCenter={{ x: 0.5, y: 0.5 }}
                            colors={["#4370e7", "#4370e7", "#479ae8", "#4ad4e8"]}>
                            <View style={{
                                flexDirection: 'row',
                                marginTop: 20,
                                alignItems: 'center',
                                marginBottom: 10,

                            }}>

                                <TouchableOpacity
                                    onPress={() => {
                                        navigation.goBack()
                                    }}>
                                    <BackIcon />
                                </TouchableOpacity>


                            </View>
                        </LinearGradient>)
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

                }
            }}
            scrollEventThrottle={1000}
        />
        {isLoading && <LoaderComponent />}
    </SafeAreaView>)
}
export default ChequeStatus;
import React, { useContext, useEffect, useState, useCallback } from "react";
import { SafeAreaView, View, TouchableOpacity, Image, FlatList } from 'react-native';
import {
    settingMenu, rightArrow
} from '../../../assets/icons'
import { LoaderComponent, AccountDropDownView, AuthHeader, MainButton } from '../../components';
import { AppContext } from "../../../themes/AppContextProvider";
import StyleTextView from '../../components/input/StyleTextView';
import { fontName, fontSize } from "../../../styles/global.config";
import Services from '../../api/Services'
import { useTranslation } from 'react-i18next';
import { AUTH_KEYS } from '../../../assets/translations/constants';
import { showMessage } from "react-native-flash-message";
import { useSelector } from 'react-redux';
import { getAccountDetailsSelector, profileSelector } from '../../store/selectors';
import { SERVICES } from "../../routes";
import { amountFormat, sentenceCase } from '../../utils/amount-util';
import { Overlay } from 'react-native-elements';
import PlainButton from "../../components/button/PlainButton";
import { MoreInfoIcon, } from "../../../assets/svg";
const ChequeDepositedByMe = ({ navigation, route }) => {
    const { params } = route
    const [isLoading, setLoading] = useState(false);
    const { t, i18n } = useTranslation();
    const [showInfoView, setShowInfoView] = useState(false)
    const accDetailsData = useSelector(getAccountDetailsSelector);
    const accountTypes = ["CA", "SB", "OD"];
    const accountType = {
        "SBA": "Saving a/c",
        "CAA": "Current a/c",
        "ODA": "Overdraft a/c"
    }
    const profile = useSelector(profileSelector)
    const [accDetails, setAccDetails] = useState(accDetailsData.filter(v => accountTypes.indexOf(v.acctType) > -1) || []);
    const [srcAccount, setSrcAccount] = useState('');
    const { theme } = useContext(AppContext);
    const [chequeList, setChequeList] = useState([]);
    useEffect(() => {
        loadChequeList()
    }, [])
    const loadChequeList = useCallback(async () => {
        try {

            let request = {
                "accountNo": params.acctNumber,
                "profileId": profile.profileId,
                "fromDate": moment(),//"2020-02-01T22:50:03.560Z",
                "toDate": moment(),//"2020-04-30T22:50:03.561Z"

            };
            setLoading(true);
            const response = await Services.getChequeIssuedByMeDetailApi(request);
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
    const overlayInfoComponent = () => {
        return (
            <Overlay
                isVisible={showInfoView}
                onBackdropPress={() => setShowInfoView(!showInfoView)}
                height='auto'
                overlayStyle={{
                    color: theme.colors.mainBackground1,
                    margin: 10,
                    borderRadius: 10,
                    width: '80%'
                }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', padding: 15 }}>
                    <StyleTextView value={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.SHORTFALL_AMOUNT)} style={{
                        fontSize: fontSize.header3,
                        fontFamily: fontName.regular,
                        color: theme.colors.headingTextColor,
                        textAlign: 'center',
                        lineHeight: Platform.OS === 'android' ? 23 : 20
                    }} />

                    <StyleTextView
                        value={"Shortfall amount is calculated by adding the Lien amount and Total value of cheques issued, Substracting it by your Account limit and Available balance "}
                        style={{
                            fontSize: fontSize.textNormal,
                            fontFamily: fontName.regular,
                            color: theme.colors.grey,
                            textAlign: 'center',
                            marginTop: 10,
                            lineHeight: Platform.OS === 'android' ? 22 : 18
                        }} />

                    <View style={{ borderTopWidth: 1, width: '100%', marginTop: 30, paddingTop: 20, opacity: 0.2 }} />



                    <PlainButton title={t(AUTH_KEYS.LOCATE_US.OK)} onPress={() => setShowInfoView(!showInfoView)} />
                </View>
            </Overlay>
        );
    }
    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                style={{ marginHorizontal: 20, }}
                disabled
            >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 5, alignItems: 'center' }}>
                    <StyleTextView value={`${'Cheque no.'} ${item.chequeNumber}`}
                        style={{
                            fontSize: fontSize.textLarge,
                            fontFamily: fontName.medium,
                            color: theme.colors.textColor,

                        }} />
                    <StyleTextView value={`${amountFormat(item.chequeAmt)} `}
                        style={{
                            fontSize: fontSize.textLarge,
                            fontFamily: fontName.medium,

                            color: theme.colors.textColor,

                        }} />
                </View>
                <View style={{marginTop:10}}>
                    <StyleTextView value={`${'Paid to'} ${item.narration}`}
                        style={{
                            fontSize: fontSize.textSmall,
                            fontFamily: fontName.medium,
                            color: theme.colors.grey,

                        }} />
                    <StyleTextView value={`${sentenceCase(item.bankName)} ,${sentenceCase(item.branchName)}`}
                        style={{
                            fontSize: fontSize.textSmall,
                            fontFamily: fontName.medium,
                            color: theme.colors.grey,


                        }} />
                </View>
                <StyleTextView value={`${sentenceCase(item.chequeStatus)} on ${item.chequeDate}`}
                        style={{
                            fontSize: fontSize.textNormal,
                            fontFamily: fontName.medium,
                            color: theme.colors.buttonColor,


                        }} />
                <View
                    style={{height:0.5,borderBottomWidth:1,borderBottomColor:theme.colors.grey,opacity:0.6,marginTop:10,marginBottom:5}}
                />
            </TouchableOpacity>
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

        <AuthHeader
            title={`${accountType[params.accountType]} ${params.acctNumber}`}
            navigation={navigation}
        />
        {overlayInfoComponent()}
        <FlatList
            data={chequeList}
            extraData={chequeList}
            ListHeaderComponent={() => {
                if (chequeList.length > 0) {
                    return (
                        <View
                            style={{ backgroundColor: theme.colors.white, flexDirection: 'row', margin: 10, borderRadius: 5, padding: 10, marginHorizontal: 20, }}>

                            <View style={{ width: '30%' }}>
                                <StyleTextView value={'Cheques'}
                                    style={{
                                        fontSize: fontSize.textSmall,
                                        fontFamily: fontName.medium,
                                        textAlign: 'center',
                                        color: theme.colors.grey,

                                    }} />
                                <StyleTextView value={params.totalCheques}
                                    style={{
                                        fontSize: fontSize.textLarge,
                                        fontFamily: fontName.medium,
                                        textAlign: 'center',
                                        color: theme.colors.headingTextColor,

                                    }} />

                            </View>
                            <View style={{ width: '70%' }}>
                                <StyleTextView value={'Total value'}
                                    style={{
                                        fontSize: fontSize.textSmall,
                                        fontFamily: fontName.medium,
                                        textAlign: 'center',
                                        color: theme.colors.grey,

                                    }} />
                                <StyleTextView value={amountFormat(params.totalChequeAmount)}
                                    style={{
                                        fontSize: fontSize.textLarge,
                                        fontFamily: fontName.medium,
                                        textAlign: 'center',
                                        color: theme.colors.headingTextColor,

                                    }} />
                                {params.shortFall && (<TouchableOpacity
                                    style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center', marginTop: 5 }}
                                    onPress={() => {
                                        setShowInfoView(!showInfoView)
                                    }}
                                >
                                    <MoreInfoIcon color={theme.colors.pinkColor} />
                                    <StyleTextView value={`${'Shortfall'} ${amountFormat(params.shortFallAmount)}`}
                                        style={{
                                            fontSize: fontSize.textLarge,
                                            fontFamily: fontName.medium,

                                            textAlign: 'right',
                                            color: theme.colors.pinkColor,

                                        }}
                                    />
                                </TouchableOpacity>)

                                }
                            </View>

                        </View>
                    )
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
export default ChequeDepositedByMe;
import React, { useContext, useEffect, useState, useCallback } from "react";
import { SafeAreaView, Text, View, TouchableOpacity, Image, FlatList } from 'react-native';
import {
    downArrow, rightArrow,
    noSearchIcon
} from '../../../assets/icons'
import { LoaderComponent, AccountDropDownView, AuthHeader, MainButton, CustomCallenderComponent } from '../../components';
import { AppContext } from "../../../themes/AppContextProvider";
import StyleTextView from '../../components/input/StyleTextView';
import { fontName, fontSize } from "../../../styles/global.config";
import Services from '../../api/Services'
import { showMessage } from "react-native-flash-message";
import { useSelector } from 'react-redux';
import { getAccountDetailsSelector, profileSelector } from '../../store/selectors';
import { SERVICES } from "../../routes";
import { useTranslation } from 'react-i18next';
import { AcceptTermsIcon, MoreInfoIcon, RadioButtonUncheckedIcon } from "../../../assets/svg";
import { Overlay } from 'react-native-elements';
import PlainButton from "../../components/button/PlainButton";
import moment from 'moment';
import { amountFormat } from '../../utils/amount-util';
import { AUTH_KEYS } from "../../../assets/translations/constants";
const ChequeStatusDetail = ({ navigation }) => {
    const [isLoading, setLoading] = useState(false);
    const { t, i18n } = useTranslation();
    const accDetailsData = useSelector(getAccountDetailsSelector);
    const profile = useSelector(profileSelector)
    var d = new Date();
    const [customDateShow, setCustomDateShow] = useState({ show: false, type: '' })
    const [fromDate, setFromDate] = useState(moment().subtract(5, 'day'));
    const [toDate, setToDate] = useState(moment());
    const accountTypes = ["CA", "SB", "OD"];
    const [showInfoView, setShowInfoView] = useState(false)
    const [showCustomDateView, setCustomDateView] = useState(false)
    const [accDetails, setAccDetails] = useState(accDetailsData.filter(v => accountTypes.indexOf(v.acctType) > -1) || []);
    const [srcAccount, setSrcAccount] = useState('');
    const { theme } = useContext(AppContext);
    const [chequeType, setChequeType] = useState("I");
    const [customDate, setCustomDate] = useState("");
    const [chequeList, setChequeList] = useState([]);
    const accountType = {
        "SBA": "Saving a/c",
        "CAA": "Current a/c",
        "ODA": "Overdraft a/c"
    }
    const [clearingChequeList, setClearingChequeList] = useState([]);
    const [depositedChequeList, setDepositedChequeList] = useState([]);
    useEffect(() => {
        loadChequeList(accDetailsData.find(v => v.primaryAccount === true).acctNo);
        loadChequedByMeList();
    }, [])
    const loadChequeList = useCallback(async (account) => {
        try {

            let request = {
                "accountNo": account,

            };
            setLoading(true);
            const response = await Services.getChequeDetailApi(request);
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
        [navigation, chequeList, srcAccount]
    );
    const loadChequedByMeList = useCallback(async () => {
        try {

            let request = {
                "profileId": profile.profileId,
                "fromDate": moment(),//"2020-02-01T22:50:03.560Z"
                "toDate": moment(),//"2020-04-30T22:50:03.561Z"
            };
            setLoading(true);
            const response = await Services.getChequeIssuedByMeApi(request);
            setClearingChequeList(response);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            // showMessage({
            //     message: "",
            //     description: error.message || error.error,
            //     type: "danger",
            //     hideStatusBar: true,
            //     backgroundColor: "black", // background color
            //     color: "white", // text color
            // });
        }
    },
        [navigation, clearingChequeList]
    );
    const loadChequedDepositedByMeList = useCallback(async (request) => {
        try {
            setLoading(true);
            const response = await Services.getChequeDepositedByMeApi(request);
            setDepositedChequeList(response.chqDeposistedOrIssuedByMeDetails);
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
        [navigation, depositedChequeList, fromDate, toDate]
    );
    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                style={{ backgroundColor: theme.colors.white, flexDirection: 'row', margin: 10, borderRadius: 5, padding: 10, marginHorizontal: 20, }}
                onPress={() => {
                    const brnCode = accDetails.find(v => v.acctNo === srcAccount).acctBranchID || ''
                    navigation.navigate(SERVICES.CHEQUE_LEAF, { ...item, srcAccount, brnCode, chequeBookList: chequeList })
                }}
            >
                <View style={{ width: '90%' }}>
                    <StyleTextView value={`${t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.CHEQUE_BOOK)}`}
                        style={{
                            fontSize: fontSize.textLarge,
                            fontFamily: fontName.medium,
                            color: theme.colors.grey,
                            paddingTop: 5,

                        }} />
                    <StyleTextView value={`${item.beginCheque}`}
                        style={{
                            fontSize: fontSize.textLarge,
                            fontFamily: fontName.medium,
                            paddingTop: 5,
                            color: theme.colors.headingTextColor,

                        }} />
                    <StyleTextView value={`${t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.ISSUED_ON)}  ${item.issueDate} `}
                        style={{
                            fontSize: fontSize.textLarge,
                            fontFamily: fontName.medium,
                            paddingTop: 5,
                            color: theme.colors.textColor,

                        }} />
                </View>
                <View style={{ width: '10%', alignItems: 'center', justifyContent: 'center' }}>
                    <Image
                        style={{ width: 10, height: 10, marginLeft: 10, tintColor: theme.colors.buttonColor }}
                        source={rightArrow}
                    />
                </View>
            </TouchableOpacity>
        )
    }
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
    const overlayCustomDateComponent = () => {
        const RenderDatePicker = ({ label, onPress, date }) => {
            return (
                <View>
                    <TouchableOpacity
                        onPress={onPress}>
                        <Text style={{ fontFamily: fontName.medium, color: theme.colors.grey }}>{label}</Text>
                        <View style={{ borderBottomWidth: 1, borderBottomColor: theme.colors.grey, flexDirection: 'row', alignItems: 'center', }}>
                            <Text style={{ fontFamily: fontName.medium, fontSize: fontSize.textNormal, color: theme.colors.headingTextColor, paddingTop: 10, paddingBottom: 5, paddingRight: 5, opacity: 0.8 }}>{moment(date).format('DD-MM-YYYY') + ""}</Text>

                            <Image
                                source={downArrow}
                                style={{ height: 15, width: 15, marginLeft: 5, tintColor: theme.colors.buttonColor }}
                            />
                            {/* <DownArrowIcon color={theme.colors.buttonColor} /> */}

                        </View>
                    </TouchableOpacity>
                </View>)
        }
        return (
            <Overlay
                isVisible={showCustomDateView}
                onBackdropPress={() => {
                    setCustomDateView(!showCustomDateView)
                    setCustomDate("")
                }}
                height='auto'
                overlayStyle={{
                    color: theme.colors.mainBackground1,
                    margin: 10,
                    width: '80%'
                }}>
                <StyleTextView
                    value={t(AUTH_KEYS.MAIN_SCREEN.CHOOSE_DATE)}
                    style={{ color: theme.colors.headingTextColor, fontFamily: fontName.medium, marginHorizontal: 35, marginTop: 20 }}
                />
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', paddingLeft: 10, paddingVertical: 10 }}>
                    <RenderDatePicker
                        label={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.FROM_DATE)}
                        onPress={() => {
                            setCustomDateView(!showCustomDateView)
                            setCustomDateShow({ show: true, type: 'Start' })
                        }}
                        date={fromDate}
                    />
                    <View style={{
                        borderWidth: 1,
                        borderColor: theme.colors.grey,
                        position: "absolute",
                        height: `100%`,
                        flex: 1,
                        width: 0.5,
                        left: '52%',
                        opacity: 0.5,
                        flexWrap: 'wrap',
                        overflow: 'hidden'
                    }} />
                    <RenderDatePicker
                        label={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.TO_DATE)}
                        onPress={() => {
                            setCustomDateView(!showCustomDateView)
                            setCustomDateShow({ show: true, type: 'End' })

                        }}
                        date={toDate}
                    />
                </View>

                <View style={{ justifyContent: 'flex-end', alignItems: 'center', padding: 15, flexDirection: 'row', marginHorizontal: 20, marginTop: 20, marginBottom: 10 }}>


                    <PlainButton title={t(AUTH_KEYS.LOCATE_US.CANCEL)}
                        style={{
                            color: theme.colors.grey,
                            fontSize: fontSize.textNormal,
                            fontFamily: fontName.medium,
                        }}
                        onPress={() => {
                            setCustomDateView(!showCustomDateView)
                            setCustomDate("")
                        }
                        } />


                    <PlainButton title={t(AUTH_KEYS.LOCATE_US.OK)}
                        style={{
                            fontFamily: fontName.medium,
                            marginLeft: 25

                        }}
                        onPress={() => {
                            const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                            const firstDate = new Date(fromDate)
                            const secondDate = new Date(toDate)
                            const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
                            if (firstDate > secondDate) {
                                showMessage({
                                    message: "Invalid date",
                                    description: "From date should be less than or equal to To Date",
                                    type: "danger",
                                    hideStatusBar: true,
                                    backgroundColor: "black", // background color
                                    color: "white", // text color
                                });
                                return
                            }
                            setCustomDateView(!showCustomDateView)
                            setCustomDate("")
                            let request = {
                                "profileId": profile.profileId,
                                "fromDate": fromDate,
                                "toDate": toDate,
                                "accountNo": srcAccount
                            }
                            loadChequedDepositedByMeList(request)


                        }
                        } />
                </View>
            </Overlay>
        );
    }
    const renderItemClearingCheques = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate(SERVICES.CHEQUE_ISSUED_BY_ME, item)
                }}
                style={{ backgroundColor: theme.colors.white, flexDirection: 'row', margin: 10, borderRadius: 5, padding: 10, marginHorizontal: 20, }}
            >
                <View>
                    <StyleTextView value={`${accountType[item.accountType] || item.accountType} ${item.acctNumber}`}
                        style={{
                            fontSize: fontSize.textNormal,
                            fontFamily: fontName.medium,
                            color: theme.colors.grey,
                            paddingTop: 5,

                        }} />
                    <View style={{ height: 0.5, opacity: 0.5, backgroundColor: theme.colors.grey, marginTop: 10, marginBottom: 10 }} />
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ width: '30%', alignItems: 'center', justifyContent: 'center' }}>
                            <StyleTextView value={`${t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.CHEQUES)}`}
                                style={{
                                    fontSize: fontSize.textNormal,
                                    fontFamily: fontName.medium,
                                    paddingTop: 5,
                                    color: theme.colors.grey,

                                }} />
                            <StyleTextView value={`${amountFormat(item.totalCheques)}`}
                                style={{
                                    fontSize: fontSize.stextLarge,
                                    fontFamily: fontName.medium,
                                    paddingTop: 5,
                                    color: theme.colors.headingTextColor,

                                }} />
                        </View>
                        <View style={{ width: '60%', alignItems: 'center', justifyContent: 'center' }}>
                            <StyleTextView value={`${t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.TOTAL_VALUE)}`}
                                style={{
                                    fontSize: fontSize.textNormal,
                                    fontFamily: fontName.medium,
                                    paddingTop: 5,
                                    color: theme.colors.grey,

                                }} />
                            <StyleTextView value={` ${amountFormat(item.totalChequeAmount)} `}
                                style={{
                                    fontSize: fontSize.textLarge,
                                    fontFamily: fontName.medium,
                                    paddingTop: 5,
                                    color: theme.colors.textColor,

                                }} />
                        </View>
                        <View style={{ width: '10%', alignItems: 'center', justifyContent: 'center' }}>
                            <Image
                                style={{ width: 10, height: 10, marginLeft: 10, tintColor: theme.colors.buttonColor }}
                                source={rightArrow}
                            />
                        </View>
                    </View>
                    {item.shortFall && (<TouchableOpacity
                        style={{ flexDirection: 'row', padding: 10, alignItems: 'center', alignSelf: 'flex-end' }}
                        onPress={() => {
                            setShowInfoView(!showInfoView)
                        }}
                    >
                        <MoreInfoIcon color={theme.colors.pinkColor} />
                        <StyleTextView value={`${'Shortfall'} ${'₹'} ${item.shortFallAmount}`}
                            style={{
                                fontSize: fontSize.textLarge,
                                fontFamily: fontName.medium,
                                marginLeft: 5,
                                textAlign: 'right',
                                color: theme.colors.pinkColor,

                            }} />
                    </TouchableOpacity>)

                    }

                </View>

            </TouchableOpacity>
        )
    }
    const renderItemDepositedCheques = ({ item, index }) => {
        function sentenceCase(str) {
            if ((str === null) || (str === ''))
                return false;
            else
                str = str.toString();

            return str.replace(/\w\S*/g,
                function (txt) {
                    return txt.charAt(0).toUpperCase() +
                        txt.substr(1).toLowerCase();
                });
        }
        return (
            <TouchableOpacity
                onPress={() => {

                }}
                style={{ borderRadius: 5, padding: 10, marginHorizontal: 20, }}
            >
                <View style={{ flexDirection: 'row', marginBottom: 5 }}>

                    <StyleTextView
                        value={`${t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.CHEQUE_NO)} ${item.chequeNumber}`}
                        style={{ width: '50%', fontFamily: fontName.medium, fontSize: fontSize.textLarge, color: theme.colors.headingTextColor }}
                    />
                    <StyleTextView
                        value={`${""} ${amountFormat(item.chequeAmt)}`}
                        style={{ width: '50%', fontFamily: fontName.medium, fontSize: fontSize.textLarge, color: theme.colors.headingTextColor, textAlign: 'right' }}
                    />
                </View>
                <StyleTextView
                    value={`${t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.ISSUED_BY)} ${item.narration}`}
                    style={{ fontFamily: fontName.medium, fontSize: fontSize.textSmall, color: theme.colors.grey }}
                />
                <StyleTextView
                    value={`${sentenceCase(item.bankName)}. ${sentenceCase(item.branchName)}`}
                    style={{ fontFamily: fontName.medium, fontSize: fontSize.textSmall, color: theme.colors.grey }}
                />
                <StyleTextView
                    value={`${item.chequeStatus} ${t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.ON)} ${item.chequeDate}`}
                    style={{ fontFamily: fontName.medium, fontSize: fontSize.textLarge, color: theme.colors.buttonColor, paddingTop: 5 }}
                />
                <View style={{ borderBottomColor: theme.colors.grey, borderBottomWidth: 0.5, marginVertical: 5, paddingTop: 5 }} />
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
            title={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.CHEQUE_STATUS)}
            navigation={navigation}
        />
        {overlayInfoComponent()}
        {overlayCustomDateComponent()}
        {/* <TouchableOpacity
            style={{ position: 'absolute', top: 10, right: 10 }}
        >
            <Image
                source={settingMenu}
                style={{ width: 20, height: 25, position: 'absolute', top: 10, right: 10, tintColor: theme.colors.white }}
            />
        </TouchableOpacity> */}
        <FlatList
            data={clearingChequeList}
            extraData={clearingChequeList}
            ListHeaderComponent={() => {
                if (clearingChequeList.length > 0) {
                    return (
                        <>
                            <StyleTextView value={clearingChequeList.length > 0 ? `Here's a summary of the cheques issued by you ` : ``}
                                style={{
                                    fontSize: fontSize.textLarge,
                                    fontFamily: fontName.medium,
                                    textAlign: 'center',
                                    margin: 20,
                                    color: theme.colors.headingTextColor,

                                }} />
                        </>)
                }
                return null

            }}
            renderItem={renderItemClearingCheques}
            ListEmptyComponent={() => {
                return (
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 10 }}>
                            <TouchableOpacity style={{ flexDirection: 'row' }}
                                onPress={() => {
                                    setChequeType("I")
                                }}
                            >
                                {chequeType === "I" ? <AcceptTermsIcon /> : <RadioButtonUncheckedIcon />}
                                <StyleTextView value={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.ISSUED_BY_ME)} style={{
                                    fontSize: fontSize.textNormal,
                                    fontFamily: fontName.medium,
                                    marginHorizontal: 10,
                                    color: theme.colors.headingTextColor,
                                }} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flexDirection: 'row' }}
                                onPress={() => {
                                    setChequeType("D");
                                    let request = {
                                        "profileId": profile.profileId,
                                        "fromDate": moment().subtract(5, 'day'),
                                        "toDate": moment(),
                                        "accountNo": accDetailsData.find(v => v.primaryAccount === true).acctNo
                                    }
                                    loadChequedDepositedByMeList(request)
                                }}
                            >
                                {chequeType === "D" ? <AcceptTermsIcon /> : <RadioButtonUncheckedIcon />}
                                <StyleTextView value={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.DEPOSITED_BY_ME)} style={{
                                    fontSize: fontSize.textNormal,
                                    fontFamily: fontName.medium,
                                    marginHorizontal: 10,
                                    color: theme.colors.headingTextColor,
                                }} />
                            </TouchableOpacity>
                        </View>
                        {chequeType === "D" && (<FlatList
                            data={depositedChequeList}
                            extraData={depositedChequeList}
                            ListHeaderComponent={() => {
                                return (
                                    <View>
                                        <AccountDropDownView
                                            data={accDetails}
                                            placeholder={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.FOR_ACCOUNT)}
                                            dropDownlabel={'acctNo'}
                                            dropDownValue={"acctNo"}
                                            value={srcAccount}
                                            editable={false}
                                            // touched={sendViaError}
                                            returnKeyType='done'
                                            keyboardType='phone-pad'
                                            // errors={sendViaError}
                                            onChangeText={(text) => {
                                                setSrcAccount(text)
                                                setCustomDate("")
                                                let request = {
                                                    "profileId": profile.profileId,
                                                    "fromDate": moment().subtract(5, 'day'),
                                                    "toDate": moment(),
                                                    "accountNo": text
                                                }
                                                loadChequedDepositedByMeList(request)

                                            }} />
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 20, marginBottom: 10 }}>
                                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}
                                                onPress={() => {
                                                    setCustomDate("3M")
                                                    let request = {
                                                        "profileId": profile.profileId,
                                                        "fromDate": moment().subtract(3, 'month'),
                                                        "toDate": moment(),
                                                        "accountNo": srcAccount
                                                    }
                                                    loadChequedDepositedByMeList(request)
                                                }}
                                            >
                                                {customDate === "3M" ? <AcceptTermsIcon /> : <RadioButtonUncheckedIcon />}
                                                <StyleTextView value={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.PAST_THREE_MONTHS)} style={{
                                                    fontSize: 12,
                                                    marginLeft: 2,
                                                    fontFamily: fontName.regular,
                                                    color: theme.colors.textColor,
                                                }} />
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}
                                                onPress={() => {
                                                    setCustomDate("6M")
                                                    let request = {
                                                        "profileId": profile.profileId,
                                                        "fromDate": moment().subtract(6, 'month'),
                                                        "toDate": moment(),
                                                        "accountNo": srcAccount
                                                    }
                                                    loadChequedDepositedByMeList(request)
                                                }}
                                            >
                                                {customDate === "6M" ? <AcceptTermsIcon /> : <RadioButtonUncheckedIcon />}
                                                <StyleTextView value={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.PAST_SIX_MONTHS)} style={{
                                                    fontSize: 12,
                                                    marginLeft: 2,
                                                    fontFamily: fontName.regular,
                                                    color: theme.colors.textColor,
                                                }} />
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}
                                                onPress={() => {
                                                    setCustomDate("CM")
                                                    setCustomDateView(!showCustomDateView)

                                                }}
                                            >
                                                {customDate === "CM" ? <AcceptTermsIcon /> : <RadioButtonUncheckedIcon />}
                                                <StyleTextView value={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.CUSTOM_DATE)} style={{
                                                    fontSize: 12,
                                                    marginLeft: 2,
                                                    fontFamily: fontName.regular,
                                                    color: theme.colors.textColor,
                                                }} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>)

                            }}
                            ListEmptyComponent={() => {
                                return (<View style={{ alignSelf: 'center', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                                    <Image
                                        source={noSearchIcon}
                                        style={{ width: 80, height: 80, alignItems: 'center', alignSelf: 'center', margin: 20 }}
                                    />
                                    <StyleTextView value={t(AUTH_KEYS.MAIN_SCREEN.NO_RECORD_FOUND)}
                                        style={{
                                            textAlign: 'center', alignSelf: 'center', color: theme.colors.textColor, fontFamily: fontName.medium

                                        }} />
                                    <StyleTextView value={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.NO_CHEQUE_DEPOSITED)}
                                        style={{
                                            fontSize: fontSize.textSmall,
                                            fontFamily: fontName.regular,
                                            textAlign: 'center',
                                            marginTop: 10,
                                            marginHorizontal: 50,
                                            color: theme.colors.headingTextColor,

                                        }} />
                                </View>)
                            }}
                            renderItem={renderItemDepositedCheques}
                            onScroll={({ nativeEvent }) => {
                                if (isCloseToBottom(nativeEvent)) {

                                }
                            }}
                            scrollEventThrottle={1000}
                        />)
                        }
                        {chequeType == 'I' && (
                            <FlatList
                                data={chequeList}
                                extraData={chequeList}
                                ListHeaderComponent={() => {
                                    return (<>
                                        {chequeList.length > 0 && (<StyleTextView value={chequeList.length > 0 ? t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.CHEQUE_STATUS_DESC) : ``}
                                            style={{
                                                fontSize: fontSize.textLarge,
                                                fontFamily: fontName.medium,
                                                textAlign: 'center',
                                                margin: 20,
                                                color: theme.colors.headingTextColor,

                                            }} />)}
                                        <AccountDropDownView
                                            data={accDetails}
                                            placeholder={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.FOR_ACCOUNT)}
                                            dropDownlabel={'acctNo'}
                                            dropDownValue={"acctNo"}
                                            value={srcAccount}
                                            editable={false}
                                            // touched={sendViaError}
                                            returnKeyType='done'
                                            keyboardType='phone-pad'
                                            // errors={sendViaError}
                                            onChangeText={(text) => {
                                                setSrcAccount(text)
                                                loadChequeList(text)

                                            }} />
                                    </>)


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
                        )

                        }

                    </View>
                )
            }}
        />
        {clearingChequeList.length > 0 && (
            <View style={{ flexDirection: 'row', marginHorizontal: 20, justifyContent: 'flex-start', marginVertical: 10 }}>
                <StyleTextView value={clearingChequeList.length > 0 ? `${'Please note : After all cheques are verified, the Cheque status will be accurate. Normally, all cheques are verified by 3.30 p.m.'}` : ``}
                    style={{
                        fontSize: fontSize.textSmall,
                        fontFamily: fontName.medium,
                        color: theme.colors.grey,

                    }} />
            </View>
        )}
        {isLoading && <LoaderComponent />}
        {customDateShow.show &&
            <CustomCallenderComponent
                pastScrollRange={100}
                onSetClick={(date) => {
                    setCustomDateView(!showCustomDateView)
                    if (customDateShow.type === "Start") {
                        setFromDate(moment(date.timestamp))
                    }
                    if (customDateShow.type === "End") {
                        setToDate(moment(date.timestamp))
                    }
                    setCustomDateShow({ show: false, type: '' })
                }}
                onClose={() => {
                    setCustomDateShow({ show: false, type: '' })
                }}
                maxDate={moment().format('ddd, ll')}
            />
        }
    </SafeAreaView>)
}
export default ChequeStatusDetail;
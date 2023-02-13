import React, { useState, useContext, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Image,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { fontName, fontSize, FONTS, SIZES, colors, monthNames } from "../../../styles/global.config";
import { BackIcon, AcceptTermsIcon, Logo, RadioButtonCheckedIcon, RadioButtonUncheckedIcon } from '../../../assets/svg';
// import { AcceptTermsIcon, AcceptTermsUncheckIcon, BackIcon, CloseIcon, DebitCardIcon, MoreInfoIcon, PanCardIcon, RadioButtonCheckedIcon, RadioButtonUncheckedIcon } from "../../../assets/svg";
import LinearGradient from 'react-native-linear-gradient';
import { AppContext } from "../../../themes/AppContextProvider";
import { BottomButton, BCBDropDownView, CustomCallenderComponent, AccountDropDownView } from '../../components';
import { PAY_PEOPLE } from '../../routes';
import StyleInputView from "../../components/input/StyleInputView";
import { calenderIcon } from "../../../assets/icons";
import moment from 'moment'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { FlatList } from 'react-native-gesture-handler';
import {
    remarksBill,
    remarksBusiness,
    remarksEntertainment,
    remarksfood,
    remarksHelth,
    remarksOthers,
    remarksShopping,
    remarksTravel,
    remarksInvestment,
    remarksBillSelected,
    remarksBusinessSelected,
    remarksEntertainmentSelected,
    remarksfoodSelected,
    remarksHelthSelected,
    remarksOthersSelected,
    remarksShoppingSelected,
    remarksTravelSelected,
    remarksInvestmentSelected,
} from '../../../assets/icons';
import { showMessage } from "react-native-flash-message";
import LoaderComponent from '../../components/base/LoaderComponent';
import { useSelector } from 'react-redux';
import { getAccountDetailsSelector, profileSelector } from '../../store/selectors';
import Home from '../../api/dashboard';
import { AUTH_KEYS } from '../../../assets/translations/constants';
import { Overlay } from 'react-native-elements'
import { getAlphabetsAndNumbersSpaceOnly, getFormattedAmountDecimalFormat, amountFormatIndian, getNumbersOnly, getPrecisionPoints, getAmount, } from '../../utils/amount-util';
import StyleTextView from '../../components/input/StyleTextView';
export default function FundTransferScreen({ navigation, route }) {
    const { params } = route;
    const [showPriority, setShowPriority] = useState(false)
    const accDetailsData = useSelector(getAccountDetailsSelector);
    const selectedProfileDetails = useSelector(profileSelector);
    const { theme, changeTheme } = useContext(AppContext);
    const [amount, setAmount] = useState('');
    const [maxDate, setMaxDate] = useState(new Date());
    const [authRuleAmounts, setAuthRuleAmounts] = useState([])
    const [neftAmount, setNeftAmount] = useState('');
    const [rtgsAmount, setRTGSAmount] = useState('');
    const [srcAccount, setSrcAccount] = useState('');
    const [sendVia, setSendVia] = useState('');
    const [paymentType, setPaymentType] = useState('');
    const [disabledButton, setDisableButton] = useState(true);
    const [noInstallment, setNoInstallMent] = useState('');
    const [maximumInstallments, setMaximumInstallments] = useState([]);
    const [sendViaTypes, setSendViaTypes] = useState({});
    const [paymentTypes, setPaymentTypes] = useState({});
    const [frequencyTypes, setfrequencyTypes] = useState([]);
    const [frequencyType, setFrequencyType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [remarksTag, setRemarksTag] = useState('');
    const { t, i18n } = useTranslation();
    const [priority, setPriority] = useState("Regular")

    const [isAdvanced, setAdvanced] = useState(true);


    const [remarksList, setRemarksList] = useState([{
        icon: remarksfood,
        iconSelected: remarksfoodSelected,
        label: 'Food and Drinks',
        iconStyle: { width: 25, height: 30 },
        value: "FOOD",

    }, {
        icon: remarksEntertainment,
        iconSelected: remarksEntertainmentSelected,
        label: 'Entertainment',
        iconStyle: { width: 30, height: 30 },
        value: 'ENTERTAINMENT',
    }, {
        icon: remarksBill,
        iconSelected: remarksBillSelected,
        label: 'Utility Bills',
        iconStyle: { width: 22, height: 30 },
        value: "BILLS",
    }, {
        icon: remarksTravel,
        iconSelected: remarksTravelSelected,
        label: 'Travel',
        iconStyle: { width: 30, height: 30 },
        value: "TRAVEL",
    }, {
        icon: remarksHelth,
        iconSelected: remarksHelthSelected,
        label: 'Health',
        iconStyle: { width: 28, height: 26 },
        value: "HEALTH",

    }, {
        icon: remarksInvestment,
        iconSelected: remarksInvestmentSelected,
        label: 'Investment',
        iconStyle: { width: 28, height: 30 },
        value: "INVESTMENT",
    }, {
        icon: remarksShopping,
        iconSelected: remarksShoppingSelected,
        label: 'Shopping',
        iconStyle: { width: 28, height: 30 },
        value: "SHOPPING",

    }, {
        icon: remarksBusiness,
        iconSelected: remarksBusinessSelected,
        label: 'Business',
        iconStyle: { width: 35, height: 30 },
        value: "BUSINESS",


    }, {
        icon: remarksOthers,
        iconSelected: remarksOthersSelected,
        icon: remarksOthers,
        label: 'Others',
        iconStyle: { width: 30, height: 30 },
        value: "OTHERS",

    },])
    const accountTypes = ["CA", "SB", "OD"];
    const [isLoading, setLoading] = useState(false);
    const [accountList, setAccountList] = useState(accDetailsData.length > 0 ? accDetailsData.filter(v => accountTypes.indexOf(v.acctType) > -1) : []);
    const [selectedDate, setSelectedDate] = useState(null);
    const [showCalender, setShowCalender] = useState(false);
    const [remarks, setRemarks] = useState('');
    useEffect(() => {
        const d = new Date();
        const dateNow = new Date();
        setMaxDate(new Date(dateNow.setDate(dateNow.getDate() + 90)))
        setStartDate(`${d.getDate()} ${monthNames[d.getMonth()]}, ${d.getFullYear()} ${'(Today)'}`)
        setSelectedDate({ "dateString": moment(d), "day": d.getDate(), "month": (d.getMonth() + 1), "year": d.getFullYear(), timestamp: new Date() })
        getTransferOptionsCall();

    }, [])
    const getTransferOptionsCall = useCallback(async () => {
        try {
            let request = {
                "profileId": selectedProfileDetails.profileId,
            };
            setLoading(true);
            const { frequency, maximumInstallments, paymentTypes, transferTypes, rtgsAmount, neftAmount, authRuleAmounts } = await Home.getTransferOptions(request);
            setfrequencyTypes(frequency.map(v => { return { label: v, value: v } }));
            setMaximumInstallments(maximumInstallments.map(v => { return { label: v, value: v } }))
            setSendViaTypes(transferTypes)
            setPaymentTypes(paymentTypes)
            setRTGSAmount(rtgsAmount);
            setNeftAmount(neftAmount);
            setAuthRuleAmounts(authRuleAmounts)
            setLoading(false);
            setAdvanced(false)
        } catch (error) {
            setLoading(false);
            setAdvanced(false)
            showMessage({
                message: error.message || 'Service not reachable',
                description: error.message || error.error,
                type: "danger",
                hideStatusBar: true,
                backgroundColor: "black", // background color
                color: "white", // text color
            });
        }
    },
        [navigation, frequencyTypes, sendViaTypes, maximumInstallments, paymentTypes, rtgsAmount, neftAmount, authRuleAmounts]
    );
    const onSubmit = useCallback(
        async () => {
            const sourceAccountDetail = accDetailsData.find(v => v.acctNo === srcAccount);
            let AccountNo = {
                "contact": params.payItem.accountNo,
                "myAccount": params.payItem.acctNo,
                "Payee": params.payItem.payeeAccountNo
            }
            let payeeName = {
                "contact": params.payItem.accountName,
                "myAccount": params.payItem.acctName,
                "Payee": params.payItem.payeeNickName
            }
            let payeePhone = {
                "contact": params.payItem.mobileNo,
                "myAccount": "",
                "Payee": ""
            }
            let BankName = {
                "contact": "",
                "myAccount": "",
                "Payee": params.payItem.bankName
            }
            let DestCurrency = {
                "contact": "INR",
                "myAccount": params.payItem.acctCcy === undefined ? "INR" : params.payItem.acctCcy,
                "Payee": "INR",
            }
            let DestBranch = {
                "contact": "",
                "myAccount": params.payItem.bankBranch,
                "Payee": params.payItem.bankBranch
            }
            let IFSC = {
                "contact": "",
                "myAccount": params.payItem.ifsc,
                "Payee": params.payItem.ifscCode
            }
            let requestFT = {
                "module": "FUNDTRANSFER",
                "profileId": selectedProfileDetails.profileId,
                "fin": {
                    "srcAccount": srcAccount,
                    "srcAccBranch": sourceAccountDetail.acctBranchID,
                    "srcAccCcy": sourceAccountDetail.acctCcy,
                    "srcAccType": sourceAccountDetail.acctType,
                    "destAccount": AccountNo[params.type],
                    "destAccBranch": DestBranch[params.type],
                    "destAccCcy": DestCurrency[params.type],
                    "destBankName": BankName[params.type],
                    "paymentType": Object.keys(paymentTypes).find(key => paymentTypes[key] === paymentType),
                    "numberOfInstallments": paymentType === "Recurring SI" ? noInstallment : "",
                    "frequency": paymentType === "Recurring SI" ? frequencyType : "",
                    "destIfscCode": IFSC[params.type],
                    "srcIfscCode": sourceAccountDetail.ifsc,
                    "txnCurrency": sourceAccountDetail.acctCcy,
                    "txnDate": moment(new Date()),
                    "amount": getAmount(amount),
                    "remarks": `${'Nexa'}: ${Object.keys(sendViaTypes).find(key => sendViaTypes[key] === sendVia) === "IAT" ? "WIB" : Object.keys(sendViaTypes).find(key => sendViaTypes[key] === sendVia)}:${remarks}`,
                    "chargesBorneBy": "OUR",
                    "remarksTag": remarksTag,
                    "srcAccName": sourceAccountDetail.acctName
                },
                "nfin": {
                    "transferType": Object.keys(sendViaTypes).find(key => sendViaTypes[key] === sendVia),
                    "beneId": null,
                    "payeeName": payeeName[params.type],
                    "payeeMail": "",
                    "payeeMobile": payeePhone[params.type],
                    "scheduled": paymentType === "One Time -Scheduled",
                    recurringTransfer: paymentType === "Recurring SI",
                    "scheduledDate": paymentType === "One Time -Scheduled" ? selectedDate.timestamp : null,
                    "addpayee": false,
                    "otp": "",
                    "payeeId": params.type === "Payee" ? params.payItem.payeeId : null
                },
                "priority": priority,
                "authUsers": []
            }
            navigation.navigate(PAY_PEOPLE.PAY_PEOPLE_CONFIRM_FT, { startDate, amount, sendVia, paymentType, frequencyType: paymentType === "Recurring SI" ? frequencyType : "", noInstallment: paymentType === "Recurring SI" ? noInstallment : "", remarks, srcAccount, requestFT, mobileNo: params.type === "contact" ? params.payItem.mobileNo : "", destAccount: AccountNo[params.type] })

        }, [startDate, amount, sendVia, paymentType, frequencyType, noInstallment, remarks, srcAccount, remarksTag, priority]
    )
    const getTwoChar = (value) => {
        if (value === undefined || value === null) {
            return null
        }
        else {
            return (
                <Text style={{ alignSelf: 'center', ...FONTS.h1, color: '#FFF' }}>{value.match(/(^\S\S?|\s\S)?/g).map(v => v.trim()).join("").match(/(^\S|\S$)?/g).join("").toLocaleUpperCase()}</Text>
            )
        }

    }

    function mask(input) {
        if (input === undefined || input === null || input === 'undefined' || input === 'null') {
            return ''
        }
        return input
            .slice(0, input.length - 4)
            .replace(/([a-zA-Z0-9])/g, 'x') + input.slice(-4)
    }
    const renderHeader = () => {
        return (<LinearGradient
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
                <View style={{ width: 50, height: 50, backgroundColor: '#4ad4e8', borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginLeft: 10 }}>
                    {/* <Text style={{ alignSelf: 'center', ...FONTS.h1, color: '#FFF' }}>{params.type === 'myAccount' ? params.payItem.acctType.match(/(^\S\S?|\s\S)?/g).map(v => v.trim()).join("").match(/(^\S|\S$)?/g).join("").toLocaleUpperCase() : params.type === 'contact' ? params.payItem.accountName.match(/(^\S\S?|\s\S)?/g).map(v => v.trim()).join("").match(/(^\S|\S$)?/g).join("").toLocaleUpperCase() : params.payItem.payeeNickName.match(/(^\S\S?|\s\S)?/g).map(v => v.trim()).join("").match(/(^\S|\S$)?/g).join("").toLocaleUpperCase()}</Text> */}
                    {getTwoChar(params.type === 'myAccount' ? params.payItem.acctType : params.type === 'contact' ? params.payItem.accountName : params.payItem.payeeNickName)}
                </View>
                <View style={{ marginLeft: 20, width: '70%' }}>
                    <Text style={{ width: SIZES.width * 0.70, color: theme.colors.white, fontFamily: fontName.medium, fontSize: fontSize.header3, marginBottom: 5 }}>{`${t(AUTH_KEYS.FUND_TRANSFER.PAYING_NAME)} ${params.type === 'myAccount' ? params.payItem.acctType : params.type === 'contact' ? params.payItem.accountName : params.payItem.payeeNickName}`}</Text>
                    {params.type === "Payee" && (<Text style={{ color: theme.colors.white, fontFamily: fontName.regular, fontSize: fontSize.textNormal, opacity: 0.8, marginBottom: 5 }}>{`${params.payItem.bankName}`}</Text>)}
                    <Text style={{ color: theme.colors.white, fontFamily: fontName.regular, fontSize: fontSize.textNormal }}>{`${params.type === 'myAccount' ? params.payItem.acctNo : params.type === 'contact' ? mask(params.payItem.mobileNo) || "-" : params.payItem.payeeAccountNo}`}</Text>
                </View>

            </View>
        </LinearGradient>)
    }
    const selectPriority = () => {
        return (
            <Overlay
                isVisible={showPriority}
                onBackdropPress={() => {
                    setShowPriority(false);
                }}
                width='100%'
                overlayStyle={{
                    color: theme.colors.white,
                    width: '100%',
                    marginTop: '10%'
                }}>
                <StyleTextView value={"Authorisation priority"}
                    style={{
                        fontSize: fontSize.textLarge,
                        fontFamily: fontName.medium,
                        marginLeft: 15,
                        marginHorizontal: 20,
                        color: theme.colors.headingTextColor,

                    }} />
                <View style={{ flexDirection: 'row', marginHorizontal: 20, padding: 10, alignSelf: 'flex-start' }}>
                    <TouchableOpacity
                        style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}
                        onPress={() => {
                            setPriority("Regular")
                        }}
                    >

                        {priority === "Regular" ? <AcceptTermsIcon /> : <RadioButtonUncheckedIcon />}
                        <StyleTextView value={"Regular"}
                            style={{
                                fontSize: fontSize.textLarge,
                                fontFamily: fontName.medium,
                                marginLeft: 15,
                                color: theme.colors.headingTextColor,

                            }} />
                        <StyleTextView

                        />

                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginLeft: 20 }}
                        onPress={() => {
                            setPriority("Urgent");
                        }}
                    >
                        {priority === "Urgent" ? <AcceptTermsIcon /> :
                            <RadioButtonUncheckedIcon />}

                        <StyleTextView value={"Urgent"}
                            style={{
                                fontSize: fontSize.textLarge,
                                fontFamily: fontName.medium,
                                marginLeft: 15,
                                color: theme.colors.headingTextColor,

                            }} />

                        <StyleTextView

                        />

                    </TouchableOpacity>
                </View>

            </Overlay>
        );
    }
    function isEnabled() {
        return amount != "" && srcAccount != "" && sendVia !== "" && paymentType !== ""
    }
    const isPriorityEnable = () => {
        let priority = false
        if (authRuleAmounts.length > 0) {
            if (authRuleAmounts.filter(v => v.accountNo === srcAccount).length > 0) {
                authRuleAmounts.filter(v => v.accountNo === srcAccount).map(v => {
                    if (Math.floor(getAmount(amount)) >= v.amtFrom && Math.floor(getAmount(amount)) <= v.amtTo) {
                        if (v.authReq > 0) {
                            priority = true
                        }
                    }
                })
            }
        }
        return priority
    }
    return (<SafeAreaView
        style={{
            flex: 1,
            width: SIZES.width,

        }}>

        {/* Header */}
        {renderHeader()}
        {selectPriority()}
        <View style={{ backgroundColor: theme.colors.bgColor, flex: 1, paddingHorizontal: 15, paddingTop: 20, paddingBottom: 100 }}>
            <KeyboardAwareScrollView
                keyboardDismissMode='on-drag'
            >
                    <StyleInputView
                        placeholder={t(AUTH_KEYS.FUND_TRANSFER.AMOUNT)}
                        value={amount}
                        selecte
                        maxLength={13}
                        leftIcon={<Text style={{ alignSelf: 'center', color: theme.colors.headingTextColor, }}>{'₹'}</Text>}
                        keyboardType='numeric'
                        containerStyle={{ width: SIZES.width * 0.8, marginLeft: 15, marginTop: 20 }}
                        hintStyle={{ fontFamily: fontName.medium }}
                        inputViewStyle={{ fontFamily: fontName.medium, fontSize: fontSize.header1 }}
                        onBlurRequired
                        onBlur={() => {
                            if (isPriorityEnable() === true) {
                                setShowPriority(true);
                            }
                        }}
                        // onSubmitEditing={()=>{
                        //     console.log('_--------------')
                        //     console.log(isPriorityEnable())
                        // }}
                        onChangeText={(text) => {
                            if (getPrecisionPoints(text.replace(/^0+/, '')) <= 2) {
                                setAmount(
                                    amountFormatIndian(getNumbersOnly(text.replace(/^0+/, '')))
                                )
                                if (params.type === "Payee" && params.payItem.ifscCode.startsWith("BCBM") === false) {
                                    if (Math.floor(getNumbersOnly(text.replace(/^0+/, ''))) < neftAmount && Math.floor(getNumbersOnly(text.replace(/^0+/, ''))) < rtgsAmount) {
                                        setSendVia(sendViaTypes["IMPS"])
                                    }
                                    else if (Math.floor(getNumbersOnly(text.replace(/^0+/, ''))) >= neftAmount && Math.floor(getNumbersOnly(text.replace(/^0+/, ''))) < rtgsAmount) {
                                        setSendVia(sendViaTypes["NEFT"])
                                    }
                                    else if (Math.floor(getNumbersOnly(text.replace(/^0+/, ''))) >= rtgsAmount) {
                                        setSendVia(sendViaTypes["RTGS"])
                                    }

                                }

                            }
                            if (text.length > 0) {
                                setDisableButton(false)
                            }
                            else {
                                setDisableButton(true)
                            }
                        }}

                    />
                    <AccountDropDownView
                        data={accountList}
                        placeholder={t(AUTH_KEYS.FUND_TRANSFER.SOURCE_ACCOUNT)}
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
                            if (isPriorityEnable() === true) {
                                setShowPriority(true);
                            }
                        }} />
                    <BCBDropDownView
                        data={(params.type === 'myAccount' || params.type === 'contact') ? Object.values(sendViaTypes).map(v => {
                            return { label: v, value: v }
                        }).filter(v => v.label === "Within Bank") : params.payItem.ifscCode.startsWith("BCBM") ? Object.values(sendViaTypes).map(v => {
                            return { label: v, value: v }
                        }).filter(v => v.label === "Within Bank") : Object.values(sendViaTypes).map(v => {
                            return { label: v, value: v }
                        }).filter(v => v.label !== "Within Bank")}
                        placeholder={t(AUTH_KEYS.FUND_TRANSFER.SEND_VIA)}
                        dropDownlabel={"label"}
                        dropDownValue={"value"}
                        selectedValue={(params.type === 'myAccount' || params.type === 'contact') ? '' : params.payItem.ifscCode.startsWith("BCBM") ? '' : sendViaTypes["IMPS"]}
                        value={sendVia}
                        editable={false}
                        // touched={sendViaError}
                        returnKeyType='done'
                        keyboardType='phone-pad'
                        // errors={sendViaError}
                        onChangeText={(text) => {
                            setSendVia(text)
                        }}
                    />

                    {sendVia === sendViaTypes["IMPS"] &&
                        <Text
                            style={{
                                fontSize: fontSize.textSmall,
                                fontFamily: fontName.regular,
                                paddingLeft: 15,
                                color: theme.colors.grey,
                                paddingTop: 15
                                //textAlign: 'center',
                            }}>{"Rs.2.5 will be charged.this is immediate payment"}</Text>
                    }
                    <TouchableOpacity
                        onPress={() => {
                            setAdvanced(!isAdvanced)
                        }}
                    >
                        <Text
                            style={{
                                fontSize: fontSize.textLarge,
                                fontFamily: fontName.regular,
                                paddingLeft: 15,
                                color: theme.colors.buttonColor,
                                paddingTop: 20,
                                paddingBottom: 10
                                //textAlign: 'center',
                            }}>{"Advanced +"}</Text>
                    </TouchableOpacity>


                    {isAdvanced &&
                        <BCBDropDownView
                            data={Object.values(paymentTypes).map(v => {
                                return { label: v, value: v }
                            })}
                            placeholder={t(AUTH_KEYS.FUND_TRANSFER.PAYMENT_TYPE)}
                            dropDownlabel={"label"}
                            dropDownValue={"value"}
                            value={paymentType}
                            editable={false}
                            // touched={paymentTypeError}
                            returnKeyType='done'
                            keyboardType='phone-pad'
                            // errors={paymentTypeError}
                            onChangeText={(text) => {
                                setPaymentType(text)
                                console.log("text")
                                console.log(text)
                                if (text === paymentTypes["ONCE"]) {
                                    const d = new Date();
                                    const dateNow = new Date();
                                    setMaxDate(new Date(dateNow.setDate(dateNow.getDate() + 90)))
                                    setStartDate(`${d.getDate()} ${monthNames[d.getMonth()]}, ${d.getFullYear()} ${'(Today)'}`)
                                    setSelectedDate({ "dateString": moment(d), "day": d.getDate(), "month": (d.getMonth() + 1), "year": d.getFullYear(), timestamp: new Date() })
                                }

                                //setAdvanced(text==="One Time")

                            }} />
                    }
                    {paymentType === "Recurring SI" && (
                        <BCBDropDownView
                            data={maximumInstallments}
                            placeholder={t(AUTH_KEYS.FUND_TRANSFER.NO_OF_INSTALMENT)}
                            dropDownlabel={"label"}
                            dropDownValue={"value"}
                            value={noInstallment}
                            editable={false}
                            onChangeText={(text) => {
                                setNoInstallMent(text)
                            }} />
                    )}

                    {paymentType === "Recurring SI" && (
                        <BCBDropDownView
                            data={frequencyTypes}
                            placeholder={t(AUTH_KEYS.FUND_TRANSFER.FREQUENCY)}
                            dropDownlabel={"label"}
                            dropDownValue={"value"}
                            value={frequencyType}
                            editable={false}
                            returnKeyType='done'
                            keyboardType='phone-pad'
                            onChangeText={(text) => {
                                setFrequencyType(text)
                            }} />
                    )}
                    {isAdvanced &&
                        <TouchableOpacity
                            disabled={paymentType === "One Time"}
                            onPress={() => {
                                setShowCalender(true)
                            }}
                        >
                            <StyleInputView
                                placeholder={paymentType === "Recurring SI" ? t(AUTH_KEYS.FUND_TRANSFER.START_DATE) : t(AUTH_KEYS.FUND_TRANSFER.DATE)}
                                value={startDate}
                                editable={false}
                                containerStyle={{ width: SIZES.width * 0.8, marginLeft: 15, }}
                                onChangeText={(text) => {

                                    setStartDate(text)
                                }}
                                rightIcon={
                                    <Image
                                        source={calenderIcon}
                                        style={{ width: 20, height: 20, tintColor: theme.colors.buttonColor, marginRight: 5 }}
                                    />
                                }
                            />
                        </TouchableOpacity>
                    }
                    <StyleInputView
                        placeholder={t(AUTH_KEYS.FUND_TRANSFER.REMARKS)}
                        value={remarks}
                        maxLength={50}
                        containerStyle={{ width: SIZES.width * 0.8, marginLeft: 15, marginTop: 20 }}
                        onChangeText={(text) => {
                            setRemarks(getAlphabetsAndNumbersSpaceOnly(text))
                        }}

                    />
                    <FlatList
                        data={remarksList}
                        extraData={remarksList}
                        style={{ width: SIZES.width * 0.90, marginLeft: 20 }}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item, index }) => {
                            return (
                                <View>
                                    <Text style={{ overflow: 'hidden', fontSize: 6, fontFamily: fontName.bold, padding: 5, backgroundColor: item.isSelected ? '#4275ef' : null, marginTop: 5, color: colors.textColorWhite }} >{item.isSelected ? item.label : ''}</Text>
                                    <TouchableOpacity
                                        style={{ paddingVertical: 10, paddingRight: 20, overflow: 'hidden', width: 50 }}
                                        onPress={() => {
                                            setRemarksTag(item.value)
                                            const dummyarray = remarksList;
                                            let arr = dummyarray.map((item, ind) => {
                                                if (index === ind) {
                                                    item.isSelected = true
                                                }
                                                else {
                                                    item.isSelected = false
                                                }

                                                return { ...item }
                                            })
                                            setRemarksList(arr)
                                        }}

                                    >
                                        <Image
                                            source={item.isSelected ? item.iconSelected : item.icon}
                                            style={[item.iconStyle]}

                                        />

                                    </TouchableOpacity>
                                </View>)
                        }}
                    />
            </KeyboardAwareScrollView>
            <BottomButton
                disabled={isEnabled() ? false : true}
                title={t(AUTH_KEYS.REGISTER.SUBMIT)}
                // disabled={disabledButton}
                containerStyle={{ backgroundColor: disabledButton ? theme.colors.grey : theme.colors.buttonStrokeStartColor, }}
                onPress={onSubmit}
            />
        </View>
        {showCalender && <CustomCallenderComponent
            minDate={new Date().toDateString()}
            maxDate={maxDate.toDateString()}
            futureScrollRange={3}
            pastScrollRange={0}
            onClose={() => {
                setShowCalender(false)

            }}
            onSetClick={(date) => {
                if (date) {
                    setSelectedDate(date)
                    setStartDate(`${date.day} ${monthNames[date.month - 1]}, ${date.year}`)
                    setShowCalender(false)
                    setShowCalender(false)
                }

            }}
        />}

        {isLoading && <LoaderComponent />}
    </SafeAreaView>)
}
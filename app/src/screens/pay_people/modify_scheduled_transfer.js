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
import { BottomButton, AuthHeader, BCBDropDownView, CustomCallenderComponent, AccountDropDownView } from '../../components';
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
export default function ModifyScheduledTransferScreen({ navigation, route }) {
    const { params } = route;
    const [showPriority, setShowPriority] = useState(false)
    const accDetailsData = useSelector(getAccountDetailsSelector);
    const selectedProfileDetails = useSelector(profileSelector);
    const { theme, changeTheme } = useContext(AppContext);
    const [amount, setAmount] = useState(params.amount + '');
    const [maxDate, setMaxDate] = useState(new Date());
    const [authRuleAmounts, setAuthRuleAmounts] = useState([])
    const [neftAmount, setNeftAmount] = useState('');
    const [rtgsAmount, setRTGSAmount] = useState('');
    const [srcAccount, setSrcAccount] = useState('');
    const [sendVia, setSendVia] = useState('');
    const [paymentType, setPaymentType] = useState('');
    const [disabledButton, setDisableButton] = useState(true);
    const [noInstallment, setNoInstallMent] = useState(params.pendingInstallments + '');
    const [maximumInstallments, setMaximumInstallments] = useState([]);
    const [sendViaTypes, setSendViaTypes] = useState({});
    const [paymentTypes, setPaymentTypes] = useState({});
    const [frequencyTypes, setfrequencyTypes] = useState([]);
    const [frequencyType, setFrequencyType] = useState(params.frequency);
    const [startDate, setStartDate] = useState('');
    const [remarksTag, setRemarksTag] = useState('');
    const { t, i18n } = useTranslation();
    const [priority, setPriority] = useState("Regular")
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
        console.log(params)

        const d = new Date(params.scheduledDate);
        const dateNow = new Date(params.scheduledDate);
        setMaxDate(new Date(dateNow.setDate(dateNow.getDate() + 90)))
        setStartDate(`${d.getDate()} ${monthNames[d.getMonth()]}, ${d.getFullYear()}`)
        setSelectedDate({ "dateString": moment(d), "day": d.getDate(), "month": (d.getMonth() + 1), "year": d.getFullYear(), timestamp: new Date(params.scheduledDate) })
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
        } catch (error) {
            setLoading(false);
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
            let requestFT = {
                "scheduledId": params.id,
                "scheduledDate": selectedDate.timestamp,
                "amount": getAmount(amount),
                "remarks": remarks,
                "remarksTag": remarksTag,
                "numberOfInstallments": paymentType === "Recurring SI" ? noInstallment : null,
                "frequency": paymentType === "Recurring SI" ? frequencyType : null,
                "actionType": "M",   // actionType shouble be 'M' for modification and 'C' for cancel.
                "profileId": selectedProfileDetails.profileId,
                "requestId": "MODIFY_CANCEL_VERIFY",
                "module": "FUNDTRANSFER"
            }
            console.log('*')
            navigation.navigate(PAY_PEOPLE.MODIFY_SCHEDULED_TXN_CONFIRM, { requestFT,startDate, amount, sendVia, paymentType, frequencyType, noInstallment, remarks, srcAccount, remarksTag,  })

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
                    {getTwoChar(params.payeeName)}
                </View>
                <View style={{ marginLeft: 20, width: '70%' }}>
                    <Text style={{ width: SIZES.width * 0.70, color: theme.colors.white, fontFamily: fontName.medium, fontSize: fontSize.header3, marginBottom: 5 }}>{`${t(AUTH_KEYS.FUND_TRANSFER.PAYING_NAME)} ${params.payeeName}`}</Text>
                    {(params.payeeMobile === null || params.payeeMobile === undefined || params.payeeMobile === "") && (<Text style={{ width: SIZES.width * 0.70, color: theme.colors.white, fontFamily: fontName.medium, fontSize: fontSize.header3, marginBottom: 5 }}>{`${params.destAccount}`}</Text>)}
                    {params.payeeMobile !== null && params.payeeMobile !== undefined && (<Text style={{ width: SIZES.width * 0.70, color: theme.colors.white, fontFamily: fontName.medium, fontSize: fontSize.header3, marginBottom: 5 }}>{`${params.payeeMobile}`}</Text>)}
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
        <KeyboardAwareScrollView
            keyboardDismissMode='on-drag'
            contentContainerStyle={{
                flex: 1,

            }}
        >
            {/* Header */}
            {/* <AuthHeader title={'Modify Scheduled Transper'}
                navigation={navigation}
            /> */}
            {renderHeader()}
            {selectPriority()}
            <View style={{ backgroundColor: theme.colors.bgColor, flex: 1, paddingHorizontal: 15, paddingTop: 20, paddingBottom: 100 }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}>
                    <View>

                    </View>

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
                            // if (isPriorityEnable() === true) {
                            //     setShowPriority(true);
                            // }
                        }}
                        onChangeText={(text) => {
                            if (getPrecisionPoints(text.replace(/^0+/, '')) <= 2) {
                                setAmount(
                                    amountFormatIndian(getNumbersOnly(text.replace(/^0+/, '')))
                                )
                                if (params.type === "Payee" && params.payItem.ifscCode.startsWith("BCBM") === false) {
                                    if (Math.floor(getNumbersOnly(text.replace(/^0+/, ''))) < neftAmount && Math.floor(getNumbersOnly(text.replace(/^0+/, ''))) < rtgsAmount) {
                                        setSendVia(sendViaTypes["IMPS"])
                                    }
                                    else if (Math.floor(getNumbersOnly(text.replace(/^0+/, ''))) > neftAmount && Math.floor(getNumbersOnly(text.replace(/^0+/, ''))) < rtgsAmount) {
                                        setSendVia(sendViaTypes["NEFT"])
                                    }
                                    else if (Math.floor(getNumbersOnly(text.replace(/^0+/, ''))) >= rtgsAmount) {
                                        setSendVia(sendViaTypes["RTGS"])
                                    }

                                }

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
                        disabled={true}
                        // touched={sendViaError}
                        returnKeyType='done'
                        keyboardType='phone-pad'
                        // errors={sendViaError}
                        onChangeText={(text) => {
                            setSrcAccount(text)
                            // if (isPriorityEnable() === true) {
                            //     setShowPriority(true);
                            // }
                        }} />
                    <BCBDropDownView
                        data={Object.values(sendViaTypes).map(v => {
                            return { label: v, value: v }
                        })}
                        placeholder={t(AUTH_KEYS.FUND_TRANSFER.SEND_VIA)}
                        dropDownlabel={"label"}
                        dropDownValue={"value"}
                        selectedValue={sendViaTypes[params.transferType]}
                        value={sendVia}
                        editable={false}
                        disabled
                        // touched={sendViaError}
                        returnKeyType='done'
                        keyboardType='phone-pad'
                        // errors={sendViaError}
                        onChangeText={(text) => {
                            setSendVia(text)
                        }}
                    />
                    <BCBDropDownView
                        data={Object.values(paymentTypes).map(v => {
                            return { label: v, value: v }
                        })}
                        placeholder={t(AUTH_KEYS.FUND_TRANSFER.PAYMENT_TYPE)}
                        dropDownlabel={"label"}
                        dropDownValue={"value"}
                        value={paymentType}
                        selectedValue={paymentTypes[params.paymentType]}
                        editable={false}
                        disabled
                        // touched={paymentTypeError}
                        returnKeyType='done'
                        keyboardType='phone-pad'
                        // errors={paymentTypeError}
                        onChangeText={(text) => {
                            setPaymentType(text)
                            if (text === paymentTypes["ONCE"]) {
                                const d = new Date();
                                const dateNow = new Date();
                                setMaxDate(new Date(dateNow.setDate(dateNow.getDate() + 90)))
                                setStartDate(`${d.getDate()} ${monthNames[d.getMonth()]}, ${d.getFullYear()} ${'(Today)'}`)
                                setSelectedDate({ "dateString": moment(d), "day": d.getDate(), "month": (d.getMonth() + 1), "year": d.getFullYear(), timestamp: new Date() })
                            }

                        }} />
                    {params.paymentType === "RECURRING" && (
                        <BCBDropDownView
                            data={maximumInstallments}
                            placeholder={t(AUTH_KEYS.FUND_TRANSFER.NO_OF_INSTALMENT)}
                            dropDownlabel={"label"}
                            dropDownValue={"value"}
                            value={noInstallment}
                            selectedValue={noInstallment}
                            editable={false}
                            onChangeText={(text) => {
                                setNoInstallMent(text)
                            }} />
                    )}

                    {params.paymentType === "RECURRING" && (
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
                    <TouchableOpacity
                        disabled={paymentType === "One Time"}
                        onPress={() => {
                            setShowCalender(true)
                        }}
                    >
                        <StyleInputView
                            placeholder={params.paymentType === "RECURRING" ? t(AUTH_KEYS.FUND_TRANSFER.START_DATE) : t(AUTH_KEYS.FUND_TRANSFER.DATE)}
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
                </ScrollView>
                <BottomButton
                    disabled={isEnabled() ? false : true}
                    title={t(AUTH_KEYS.REGISTER.SUBMIT)}
                    // disabled={disabledButton}
                    containerStyle={{ backgroundColor: isEnabled() ? theme.colors.buttonStrokeStartColor : theme.colors.grey, }}
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
        </KeyboardAwareScrollView>
        {isLoading && <LoaderComponent />}
    </SafeAreaView>)
}
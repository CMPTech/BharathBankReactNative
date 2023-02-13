import React, { useState, useContext, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Image,
} from 'react-native';
import { fontName, fontSize, FONTS, SIZES, colors, monthNames } from "../../../styles/global.config";
import { BackIcon, AcceptTermsIcon, Logo, RadioButtonCheckedIcon, RadioButtonUncheckedIcon } from '../../../assets/svg';
// import { AcceptTermsIcon, AcceptTermsUncheckIcon, BackIcon, CloseIcon, DebitCardIcon, MoreInfoIcon, PanCardIcon, RadioButtonCheckedIcon, RadioButtonUncheckedIcon } from "../../../assets/svg";
import LinearGradient from 'react-native-linear-gradient';
import { AppContext } from "../../../themes/AppContextProvider";
import { BottomButton, BCBDropDownView, CustomCallenderComponent } from '../../components';
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
import { Overlay } from 'react-native-elements'
import { getAlphabetsAndNumbersSpaceOnly, getFormattedAmountDecimalFormat, getNumbersOnly, getPrecisionPoints, getAmount, } from '../../utils/amount-util';
import StyleTextView from '../../components/input/StyleTextView';
export default function ReInitiateFundTransferScreen({ navigation, route }) {
    const { params } = route;
    const [showPriority, setShowPriority] = useState(false)
    const accDetailsData = useSelector(getAccountDetailsSelector);
    const selectedProfileDetails = useSelector(profileSelector);
    const { theme, changeTheme } = useContext(AppContext);
    const [amount, setAmount] = useState(params.amount + '');
    const [authRuleAmounts, setAuthRuleAmounts] = useState([])
    const [neftAmount, setNeftAmount] = useState('');
    const [rtgsAmount, setRTGSAmount] = useState('');
    const [srcAccount, setSrcAccount] = useState(params.srcAccount);
    const [sendVia, setSendVia] = useState('');
    const [paymentType, setPaymentType] = useState('');
    const [disabledButton, setDisableButton] = useState(true);
    const [noInstallment, setNoInstallMent] = useState(params.noOfInstallments);
    const [maximumInstallments, setMaximumInstallments] = useState([]);
    const [sendViaTypes, setSendViaTypes] = useState({
        "IAT": "Within Bank",
        "IMPS": "IMPS Instant (chrg:Rs+GST)",
        "NEFT": "NEFT(24X7) 30 min+",
        "RTGS": "RTGS(24X7) Instant"
    });
    const [paymentTypes, setPaymentTypes] = useState({ "ONCE": "One Time", "RECURRING": "Recurring SI", "SCHEDULED": "One Time -Scheduled" });
    const [frequencyTypes, setfrequencyTypes] = useState([]);
    const [frequencyType, setFrequencyType] = useState(params.frequency);
    const [startDate, setStartDate] = useState('');
    const [remarksTag, setRemarksTag] = useState('');
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
        const d = new Date();
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
            setSendVia(transferTypes[params.transferType]);
            setPaymentType(paymentTypes[params.paymentType])
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
            const sourceAccountDetail = accDetailsData.find(v => v.acctNo === srcAccount);
            let requestFT = {
                "module": "FUNDTRANSFER",
                "profileId": selectedProfileDetails.profileId,
                "txnId": params.txnId,
                "fin": {
                    "srcAccount": sourceAccountDetail.acctNo,
                    "srcAccBranch": sourceAccountDetail.acctBranchID,
                    "srcAccCcy": sourceAccountDetail.acctCcy,
                    "srcAccType": sourceAccountDetail.acctType,
                    "destAccount": params.destAccount,
                    "destAccBranch": "",
                    "destBankName": params.destAccountName,
                    "destAccCcy": params.destAccountAccy,
                    "paymentType": params.noOfInstallments,
                    "numberOfInstallments": params.noOfInstallments,
                    "frequency": params.frequency,
                    "destIfscCode": params.destIfscCode,
                    "srcIfscCode": params.srcIfscCode,
                    "txnCurrency": "INR",
                    "txnDate": moment(new Date()),
                    "amount": getAmount(amount),
                    "remarks": `${'Nexa'}: ${params.transferType==="IAT"?"WIB":params.transferType}: ${remarks}`,
                    "remarksTag": remarksTag,
                    "chargesBorneBy": "OUR",
                    "srcAccName": "HOTEL ROYAL INN"
                },
                "nfin": {
                    "transferType": params.transferType,
                    "beneId": null,
                    "scheduled": paymentType === "One Time -Scheduled",
                    "scheduledDate": paymentType === "One Time -Scheduled" ? selectedDate.timestamp : null,
                    "recurringTransfer": paymentType === "Recurring SI",
                    "payeeName": params.payeeName,
                    "payeeMobile": params.mobileNo,
                    "addpayee": false
                },
                "requestId": "FTVERIFYIAT",
            }


            // let requestFT = {

            // }
            navigation.navigate(PAY_PEOPLE.CONFIRM_REINITIATE, { startDate, amount, sendVia, paymentType, frequencyType, noInstallment, remarks, srcAccount, requestFT, mobileNo: params.mobileNo, destAccount: params.destAccount,isHistory:params.isHistory })

        }, [startDate, amount, sendVia, paymentType, frequencyType, noInstallment, remarks, srcAccount, remarksTag]
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
                    {/* <Text style={{ alignSelf: 'center', ...FONTS.h1, color: '#FFF' }}>{params.type === 'myAccount' ? params.payItem.acctType.match(/(^\S\S?|\s\S)?/g).map(v => v.trim()).join("").match(/(^\S|\S$)?/g).join("").toLocaleUpperCase() : params.type === 'contact' ? params.payItem.accountName.match(/(^\S\S?|\s\S)?/g).map(v => v.trim()).join("").match(/(^\S|\S$)?/g).join("").toLocaleUpperCase() : params.payeeName.match(/(^\S\S?|\s\S)?/g).map(v => v.trim()).join("").match(/(^\S|\S$)?/g).join("").toLocaleUpperCase()}</Text> */}
                    {getTwoChar(params.payeeName)}
                </View>
                <View style={{ marginLeft: 20 }}>
                    <Text style={{ color: theme.colors.white, fontFamily: fontName.medium, fontSize: fontSize.header3 }}>{`${'Paying'} ${params.type === 'myAccount' ? params.payItem.acctType : params.type === 'contact' ? params.payItem.accountName : params.payeeName}`}</Text>
                    {/* {params.type === "Payee" && (<Text style={{ color: theme.colors.white, fontFamily: fontName.regular, fontSize: fontSize.textNormal, opacity: 0.8 }}>{`${params.payItem.bankName}`}</Text>)} */}
                    <Text style={{ color: theme.colors.white, fontFamily: fontName.regular, fontSize: fontSize.textNormal }}>{`${params.destAccount}`}</Text>
                </View>

            </View>
        </LinearGradient>)
    }
    const selectPriority = () => {
        return (
            <Overlay
                isVisible={showPriority}
                onBackdropPress={() => setShowPriority(false)}
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
                <View style={{ flexDirection: 'row', marginHorizontal: 20, padding: 10 }}>
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
                            setPriority("Urgent")
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
            {renderHeader()}
            {selectPriority()}
            <View style={{ backgroundColor: theme.colors.bgColor, flex: 1, paddingHorizontal: 15, paddingTop: 20, paddingBottom: 100 }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}>
                    <StyleInputView
                        placeholder={"Amount"}
                        value={amount}
                        maxLength={10}
                        selecte
                        leftIcon={<Text style={{ alignSelf: 'center' }}>{'₹'}</Text>}
                        keyboardType='numeric'
                        containerStyle={{ width: SIZES.width * 0.8, marginLeft: 15, marginTop: 20 }}
                        hintStyle={{ fontFamily: fontName.medium }}
                        inputViewStyle={{ fontFamily: fontName.medium, fontSize: fontSize.header1 }}
                        onChangeText={(text) => {
                            if (getPrecisionPoints(text.replace(/^0+/, '')) <= 2) {
                                setAmount(
                                    getNumbersOnly(text.replace(/^0+/, ''))
                                )
                                if (params.type === "Payee" && params.destIfscCode.startsWith("BCB") === false) {
                                    if (Math.floor(getNumbersOnly(text.replace(/^0+/, ''))) < neftAmount && Math.floor(getNumbersOnly(text.replace(/^0+/, ''))) < rtgsAmount) {
                                        setSendVia(sendViaTypes["IMPS"])
                                    }
                                    else if (Math.floor(getNumbersOnly(text.replace(/^0+/, ''))) > neftAmount && Math.floor(getNumbersOnly(text.replace(/^0+/, ''))) <= rtgsAmount) {
                                        setSendVia(sendViaTypes["NEFT"])
                                    }
                                    else if (Math.floor(getNumbersOnly(text.replace(/^0+/, ''))) > rtgsAmount) {
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
                    <BCBDropDownView
                        data={accountList.map(v => {
                            return { label: v.acctNo, value: v.acctNo }
                        })}
                        placeholder={"Source Account"}
                        dropDownlabel={'label'}
                        dropDownValue={"value"}
                        value={srcAccount}
                        selectedValue={srcAccount}
                        editable={false}
                        // touched={sendViaError}
                        returnKeyType='done'
                        keyboardType='phone-pad'
                        // errors={sendViaError}
                        onChangeText={(text) => {
                            setSrcAccount(text)
                        }} />
                    <BCBDropDownView
                        data={Object.values(sendViaTypes).map(v => {
                            return { label: v, value: v }
                        })}
                        placeholder={"Send via"}
                        dropDownlabel={"label"}
                        disabled
                        dropDownValue={"value"}
                        selectedValue={sendViaTypes[params.transferType]}
                        value={sendVia}
                        editable={false}
                        // touched={sendViaError}
                        returnKeyType='done'
                        keyboardType='phone-pad'
                        // errors={sendViaError}
                        onChangeText={(text) => {
                            setSendVia(text)
                        }} />
                    <BCBDropDownView
                        data={Object.values(paymentTypes).map(v => {
                            return { label: v, value: v }
                        })}
                        placeholder={"Payment Type"}
                        dropDownlabel={"label"}
                        dropDownValue={"value"}
                        disabled
                        selectedValue={paymentTypes[params.paymentType]}
                        value={paymentType}
                        editable={false}
                        // touched={paymentTypeError}
                        returnKeyType='done'
                        keyboardType='phone-pad'
                        // errors={paymentTypeError}
                        onChangeText={(text) => {
                            setPaymentType(text)
                        }} />
                    {paymentType === "Recurring SI" && (
                        <BCBDropDownView
                            data={maximumInstallments}
                            placeholder={"No of Installment"}
                            dropDownlabel={"label"}
                            dropDownValue={"value"}
                            disabled
                            value={noInstallment}
                            editable={false}
                            onChangeText={(text) => {
                                setNoInstallMent(text)
                            }} />
                    )}

                    {paymentType === "Recurring SI" && (
                        <BCBDropDownView
                            data={frequencyTypes}
                            placeholder={"Frequency"}
                            dropDownlabel={"label"}
                            dropDownValue={"value"}
                            value={frequencyType}
                            disabled
                            editable={false}
                            returnKeyType='done'
                            keyboardType='phone-pad'
                            onChangeText={(text) => {
                                setFrequencyType(text)
                            }} />
                    )}
                    <StyleInputView
                        placeholder={paymentType === "Recurring SI" ? "Start Date" : "Date"}
                        value={startDate}
                        editable={false}
                        containerStyle={{ width: SIZES.width * 0.8, marginLeft: 15, }}
                        disabled
                        onChangeText={(text) => {

                            setStartDate(text)
                        }}
                        rightIcon={<TouchableOpacity
                            disabled={paymentType === "One Time"}
                            onPress={() => {
                                setShowCalender(true)
                            }}
                        >
                            <Image
                                source={calenderIcon}
                                style={{ width: 20, height: 20, tintColor: theme.colors.buttonColor, marginRight: 5 }}
                            />
                        </TouchableOpacity>}
                    />
                    <StyleInputView
                        placeholder={"Remarks"}
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
                    title={"Submit"}
                    // disabled={disabledButton}
                    containerStyle={{ backgroundColor: isEnabled() ? theme.colors.buttonStrokeStartColor : theme.colors.grey, }}
                    onPress={() => {
                        if (authRuleAmounts.length > 0) {
                            if (authRuleAmounts.filter(v => v.accountNo === srcAccount).length > 0) {
                                authRuleAmounts.filter(v => v.accountNo === srcAccount).map(v => {
                                    if (Math.floor(getAmount(amount)) >= v.amtFrom && Math.floor(getAmount(amount)) <= v.amtTo) {
                                        if (v.authReq > 0) {
                                            setShowPriority(true)

                                        }
                                        else {
                                            setShowPriority(false);
                                            onSubmit();
                                        }
                                    }
                                    else {
                                        setShowPriority(false)
                                        onSubmit();
                                    }
                                })
                            }
                            else {
                                setShowPriority(false);
                                onSubmit();
                            }

                        }
                        else {
                            onSubmit();
                        }

                    }}
                />
            </View>
            {showCalender && <CustomCallenderComponent
                minDate={new Date().toDateString()}
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
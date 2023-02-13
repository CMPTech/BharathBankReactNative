import React, {
    useState, useEffect, useCallback,
    useContext
} from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, TextInput, ScrollView } from 'react-native';
import { fontName, fontSize, FONTS, SIZES, colors } from "../../../styles/global.config";
import {
    setting,
    radioNotSelected,
    radioSelected,
    downArrow,
} from '../../../assets/icons';
import { AcceptTermsIcon, BackIcon, DownArrowIcon, Logo, RadioButtonUncheckedIcon } from "../../../assets/svg";
import LinearGradient from 'react-native-linear-gradient';
import { ACCOUNTS } from '../../routes';
import { getAccountDetailsSelector } from '../../store/selectors';
import { useSelector } from "react-redux";
import { mobileNumberSelector, profileSelector } from "../../store/selectors";
import moment from 'moment'
import { CustomCallenderComponent, LoaderComponent, BCBDropDownView, AuthHeader, AccountDropDownView, AlerComponent } from '../../components'
import { AppContext } from "../../../themes/AppContextProvider";
import { useTranslation } from 'react-i18next';
import { AUTH_KEYS } from '../../../assets/translations/constants';
import { showMessage } from "react-native-flash-message";
export default function EStatementViewScreen({ navigation, route }) {
    const [accountSelected, setAccountSelected] = useState('');
    const { theme, changeTheme } = useContext(AppContext)
    const accountTypes = ["CA", "SB", "OD"];
    const { t, i18n } = useTranslation();
    const accDetailsData = useSelector(getAccountDetailsSelector);
    const [customDate, setCustomDate] = useState({ show: false, type: '' })
    const [accountList, setAccountList] = useState(accDetailsData.length > 0 ? accDetailsData.filter(v => accountTypes.indexOf(v.acctType) > -1) : []);
    const [statementType, setStatementType] = useState('');
    const [transactionType, setTransactionType] = useState('');
    const [statementTypes, setStatementTypes] = useState([{ label: t(AUTH_KEYS.MAIN_SCREEN.STATEMNT_VIEW), value: "Statement view" }, { label: t(AUTH_KEYS.MAIN_SCREEN.PASSBOOK_VIEW), value: "Passbook view" }]);
    const [transactionTypes, setTransactionTypes] = useState([{ label: t(AUTH_KEYS.MAIN_SCREEN.TRANSACTION_TYPE_ALL), value: "All" }, { label: t(AUTH_KEYS.MAIN_SCREEN.TRANSACTION_TYPE_DEBIT), value: "Debit" }, { label: t(AUTH_KEYS.MAIN_SCREEN.TRANSACTION_TYPE_CREDIT), value: "Credit" }]);
    const { params } = route;
    var d = new Date();
    const profile = useSelector(profileSelector)
    const [fromDate, setFromDate] = useState(moment().subtract(3, 'month'));
    const [toDate, setToDate] = useState(moment());
    const [isLoading, setLoading] = useState(false);
    const [showDate, setShowDate] = useState(false);
    const [showDateError, setShowDateError] = useState(false)
    const [selectDate, setSelectedDate] = useState([{
        label: t(AUTH_KEYS.MAIN_SCREEN.LAST_THREE_MONTH),
        value: 'Past 3 months',
        isSelected: true,
    }, {
        label: t(AUTH_KEYS.MAIN_SCREEN.LAST_SIX_MONTH),
        value: 'Past 6 months',
        isSelected: false,
    }, {
        label: t(AUTH_KEYS.MAIN_SCREEN.CUSTOM_DATE_RANGE),
        value: 'Custom date range',
        isSelected: false,
    }])
    useEffect(() => {
        if(params.accountItem.acctNo!==undefined)
        {
      setAccountSelected(params.accountItem.acctNo)
        }
        
        //setAccountList(accDetailsData)
    }, []);
    // const getAllAccountDetails = useCallback(async () => {
    //     try {
    //         let request = {
    //             userName: mobileNumberInApp || "",
    //             profileId: profile.profileId,
    //         }
    //         setLoading(true);
    //         const response = await Accounts.getAllAccountDetailsApi(request);
    //         setLoading(false);
    //         setAccountList(response.custAccDetails.filter(v => v.acctType === 'SBA'))
    //         if (response.custAccDetails.filter(v => v.acctType === 'SBA') && response.custAccDetails.filter(v => v.acctType === 'SBA')[0].acctNo !== null) {
    //             setAccountSelected(response.custAccDetails.filter(v => v.acctType === 'SBA')[0].acctNo)
    //         }

    //     } catch (error) {
    //         setLoading(false);
    //         showMessage({
    //             message: "Error message",
    //              description: error.message || error.error,
    //             type: "danger",
    //             hideStatusBar: true,
    //    backgroundColor: "black", // background color
    //    color: "white", // text color
    //         });
    //     }
    // },
    //     [navigation, accountList]
    // );
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
                //justifyContent: 'space-between',
                marginBottom: 10,
            }}>
                <TouchableOpacity
                    style={{ alignItems: 'center', marginLeft: 10, width: '10%' }}
                    onPress={() => {
                        navigation.goBack()

                    }}
                >
                    <BackIcon />
                </TouchableOpacity>
                <Text style={{
                    ...FONTS.h3, color: '#FFF', fontFamily: fontName.medium,
                    textAlign: 'left'
                }}>View ePassbook</Text>
                <View />
                <View />
            </View>
        </LinearGradient>)
    }
    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }}
                onPress={() => {
                    const dummyarray = selectDate;
                    let arr = dummyarray.map((item, ind) => {
                        if (index === ind) {
                            item.isSelected = true
                        }
                        else {
                            item.isSelected = false
                        }

                        return { ...item }
                    })
                    setSelectedDate(arr)
                    if (item.value === 'Past 3 months') {
                        setFromDate(moment().subtract(3, 'month'));
                        setToDate(moment())
                        setShowDate(false)
                    }
                    else if (item.value === 'Past 6 months') {
                        setFromDate(moment().subtract(6, 'month'));
                        setToDate(moment())
                        setShowDate(false)
                    }
                    else if (item.value === 'Custom date range') {
                        setFromDate(moment());
                        setToDate(moment())
                        setShowDate(true)

                    }
                }}
            >
                {/* <Image
                source={item.isSelected ? radioSelected : radioNotSelected}
                style={{ width: 25, height: 25, tintColor: item.isSelected ? '#16caa7' : '#000' }}
            /> */}

                {item.isSelected ? <AcceptTermsIcon /> : <RadioButtonUncheckedIcon />}
                <Text style={{ ...FONTS.body4, color: '#000', opacity: 0.7, marginLeft: 10 }}>{item.label}</Text>

            </TouchableOpacity>)
    }
    const RenderDatePicker = ({ label, onPress, date }) => {
        return (
            <View>
                <TouchableOpacity
                    onPress={onPress}>
                    <Text style={{ fontFamily: fontName.medium, color: theme.colors.grey }}>{label}</Text>
                    <View style={{ borderBottomWidth: 1, borderBottomColor: colors.dividerColor, flexDirection: 'row', alignItems: 'center', }}>
                        <Text style={{ fontFamily: fontName.medium, fontSize: fontSize.textNormal, color: theme.colors.headingTextColor, paddingTop: 10, paddingBottom: 5, paddingRight: 5, opacity: 0.8 }}>{moment(date).format('DD-MM-YYYY') + ""}</Text>

                        <Image
                            source={downArrow}
                            style={{ height: 15, width: 15, marginLeft: 5, tintColor: colors.buttonColor }}
                        />
                        {/* <DownArrowIcon color={theme.colors.buttonColor} /> */}

                    </View>
                </TouchableOpacity>
            </View>)
    }
    function isEnabledButton() {
        return accountSelected != "" && statementType != "" && toDate !== "" && fromDate !== ""

    }
    return (
        <View
            style={{
                flex: 1,
                //width: SIZES.width,

            }}
        >

            {/* Header */}
            {/* {renderHeader()} */}
            <AuthHeader
                title={t(AUTH_KEYS.MAIN_SCREEN.DETAILED_STATEMENT)}
                navigation={navigation} />

            <View style={{ backgroundColor: colors.detail_bacgroundColor, flex: 1, paddingHorizontal: 15, paddingTop: 20 }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}>
                    {/* Dropdown */}
                    {/* <BCBDropDownView
                        data={accountList}
                        placeholder={t(AUTH_KEYS.MAIN_SCREEN.SELECT_ACCOUNT)}
                        dropDownlabel={"label"}
                        dropDownValue={"value"}
                        value={accountSelected}
                        editable={false}
                        onChangeText={(text) => {
                            setAccountSelected(text)
                        }} /> */}
                    <AccountDropDownView
                        data={accountList}
                        placeholder={t(AUTH_KEYS.MAIN_SCREEN.SELECT_ACCOUNT)}
                        dropDownlabel={'acctNo'}
                        dropDownValue={"acctNo"}
                        value={accountSelected}
                        editable={false}
                        onChangeText={(text) => {
                            setAccountSelected(text)
                        }}
                    />
                    <BCBDropDownView
                        data={statementTypes}
                        placeholder={t(AUTH_KEYS.MAIN_SCREEN.SELECT_STATEMENT_VIEW)}
                        dropDownlabel={"label"}
                        dropDownValue={"value"}
                        value={statementType}
                        editable={false}
                        onChangeText={(text) => {
                            setStatementType(text)
                        }} />
                    <BCBDropDownView
                        data={transactionTypes}
                        placeholder={t(AUTH_KEYS.MAIN_SCREEN.SELECT_TRANSACTION_TYPE)}
                        dropDownlabel={"label"}
                        dropDownValue={"value"}
                        value={transactionType}
                        editable={false}
                        onChangeText={(text) => {
                            setTransactionType(text)
                        }} />
                    {/* Body  */}
                    <View style={{ marginTop: 5, height: 140, marginLeft: 10, marginTop: 20 }} >
                        <FlatList
                            data={selectDate}
                            extraData={selectDate}
                            keyExtractor={(item, index) => `${index}`}
                            renderItem={renderItem}
                            ListEmptyComponent={() => {
                                return (<View></View>)
                            }}

                        />
                    </View>
                    {/* Start date  and end Date */}
                    {showDate &&
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', paddingLeft: 20 }}>
                            <RenderDatePicker
                                label={t(AUTH_KEYS.MAIN_SCREEN.START_DATE)}
                                date={fromDate}
                                onPress={() => {
                                    setCustomDate({ show: true, type: 'Start' })
                                }}
                            />
                            <View style={{ width: 1, borderWidth: 0.3, opacity: 0.2 }} />
                            <RenderDatePicker
                                label={t(AUTH_KEYS.MAIN_SCREEN.END_DATE)}
                                date={toDate}
                                onPress={() => {
                                    setCustomDate({ show: true, type: 'End' })

                                }}
                            />
                        </View>
                    }


                </ScrollView>
                {/* View Button */}
                <TouchableOpacity
                    disabled={isEnabledButton() ? false : true}
                    style={{ position: 'absolute', bottom: 0, padding: 15, width: SIZES.width, alignItems: 'center', justifyContent: 'center', backgroundColor: isEnabledButton() ? theme.colors.buttonStrokeStartColor : theme.colors.grey, opacity: 0.8 }}
                    onPress={() => {
                        if (selectDate.filter(v => v.isSelected === true)[0].value === 'Custom date range') {
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
                            // else if (diffDays > 92) {
                            //     showMessage({
                            //         message: "Invalid date",
                            //         description: "maximum allowed date range is 92 days",
                            //         type: "danger",
                            //         hideStatusBar: true,
                            //         backgroundColor: "black", // background color
                            //         color: "white", // text color
                            //     });
                            //     return
                            // }
                            
                        }

                        const accountDetail = accountList.find(v => v.acctNo === accountSelected)
                        let request = {
                            "accountNo": accountSelected,
                            "branchId": accountDetail.acctBranchID,
                            "fromDate": fromDate,
                            "toDate": toDate,
                            "transactionType": transactionType === "Credit" ? "C" : transactionType === "Debit" ? "D" : "",
                            "statementType": statementType,
                            "profileId": profile.profileId,
                            "hasMoreData": "N",
                            "sortIn": "D",
                        }
                        let requestD = {
                            "accountNo": accountSelected,
                            "branchId": accountDetail.acctBranchID,
                            "fromDate": fromDate,
                            "toDate": toDate,
                            "transactionType": transactionType,
                            "statementType": statementType,
                            "profileId": profile.profileId,
                        }
                        if (statementType === t(AUTH_KEYS.MAIN_SCREEN.STATEMNT_VIEW)) {
                            navigation.navigate(ACCOUNTS.VIEW_E_STATEMENT_VIEW, { requestParams: request, downloadRequest: requestD })
                        }
                        else {
                            navigation.navigate(ACCOUNTS.VIEW_E_PASS_BOOK_STATEMENT, { requestParams: request, downloadRequest: requestD })
                        }

                    }}
                >
                    <Text style={{ ...FONTS.h3, color: '#FFF', fontFamily: fontName.medium }}>{t(AUTH_KEYS.MAIN_SCREEN.VEIW)}</Text>
                </TouchableOpacity>
            </View>
            {isLoading && <LoaderComponent />}
            {customDate.show &&
                <CustomCallenderComponent
                    pastScrollRange={102}
                    onSetClick={(date) => {
                        if (customDate.type === "Start") {
                            // const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                            // const firstDate = new Date(moment(date.timestamp))
                            // const secondDate = new Date(toDate)

                            // const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
                            // if (firstDate > secondDate) {
                            //     showMessage({
                            //         message: "Invalid date",
                            //         description: "From date should be less than or equal to To Date",
                            //         type: "danger",
                            //         hideStatusBar: true,
                            //         backgroundColor: "black", // background color
                            //         color: "white", // text color
                            //     });
                            // }
                            // else if (diffDays > 92) {
                            //     showMessage({
                            //         message: "Invalid date",
                            //         description: "maximum allowed date range is 92 days",
                            //         type: "danger",
                            //         hideStatusBar: true,
                            //         backgroundColor: "black", // background color
                            //         color: "white", // text color
                            //     });
                            // }
                            // else {
                            //     setFromDate(moment(date.timestamp))
                            // }
                            setFromDate(moment(date.timestamp))
                        }
                        if (customDate.type === "End") {
                            // const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                            // const firstDate = new Date(fromDate)
                            // const secondDate = new Date(moment(date.timestamp))

                            // const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
                            // if (firstDate > secondDate) {
                            //     showMessage({
                            //         message: "Invalid date",
                            //         description: "From date should be less than or equal to To Date",
                            //         type: "danger",
                            //         hideStatusBar: true,
                            //         backgroundColor: "black", // background color
                            //         color: "white", // text color
                            //     });
                            // }
                            // else if (diffDays > 92) {
                            //     showMessage({
                            //         message: "Invalid date",
                            //         description: "maximum allowed date range is 92 days",
                            //         type: "danger",
                            //         hideStatusBar: true,
                            //         backgroundColor: "black", // background color
                            //         color: "white", // text color
                            //     });
                            // }
                            // else {
                            //     setToDate(moment(date.timestamp))
                            // }
                            setToDate(moment(date.timestamp))
                        }
                        setCustomDate({ show: false, type: '' })
                    }}
                    onClose={() => {
                        setCustomDate({ show: false, type: '' })
                    }}
                    maxDate={moment().format('ddd, ll')}
                />
            }
        </View>
    )
}

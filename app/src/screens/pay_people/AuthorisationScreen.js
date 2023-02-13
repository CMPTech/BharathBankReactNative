import React, { useState, useContext, useCallback, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    SafeAreaView
} from 'react-native';
import { fontName, fontSize, FONTS, SIZES, currencyValue, colors } from "../../../styles/global.config";
import { BackIcon, Logo } from '../../../assets/svg';
import LinearGradient from 'react-native-linear-gradient';
import { AppContext } from "../../../themes/AppContextProvider";
import { BottomButton, AlerComponent, MainButton, LoaderComponent } from '../../components';
import { PAY_PEOPLE } from '../../routes';
import { amountFormat } from '../../utils/amount-util';
import { formatDate} from '../../utils/dates-util';
import { showMessage } from "react-native-flash-message";
import Home from '../../api/dashboard';
import StyleTextView from '../../components/input/StyleTextView';
import { Image } from 'react-native';
import {
    settingMenu
} from '../../../assets/icons';
import AuthCommentComponent from './AuthComment';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { profileSelector } from '../../store/selectors';
import { t } from 'i18next';
import { AUTH_KEYS } from '../../../assets/translations/constants';
export default function AuthorizationScreen({ navigation, route }) {
    const { params } = route;
    const [isLoading, setLoading] = useState(false);
    const { theme, changeTheme } = useContext(AppContext);
    const [authPriorityEnabled, setAuthPriorityEnabled] = useState(false);
    const [backPressed, setbackPressed] = useState(false);
    const { fin, nfin } = params.req
    const selectedProfileDetails = useSelector(profileSelector);
    const [rejectComentVisble, setRejectCommentVisible] = useState(false);
    const [returnComentVisble, setReturnCommentVisible] = useState(false);
    const [returnComment, setReturnComment] = useState('');
    const [rejectComent, setRejectComment] = useState('');
    const [rejectComentError, setRejectCommentError] = useState('');
    const [authSatus, setAuthStatus] = useState('');
    const paymentTypes = {
        "ONCE": "One Time",
        "RECURRING": "Recurring SI",
        "SCHEDULED": "One Time -Scheduled"
    }
    const transferType = { "IAT": "Within Bank", "IMPS": "IMPS Instant (chrg:Rs+GST)", "NEFT": "NEFT(24X7) 30 min+", "RTGS": "RTGS(24X7) Instant" }
    const renderHeader = () => {
        return (<LinearGradient
            useAngle={true}
            angle={170}
            angleCenter={{ x: 0.5, y: 0.5 }}
            colors={["#4370e7", "#4370e7", "#479ae8", "#4ad4e8"]}>
            <View>
                <View style={{
                    flexDirection: 'row',
                    marginTop: 20,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 10
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                        <TouchableOpacity
                            style={{ alignItems: 'center', marginLeft: 10 }}
                            onPress={() => {
                                navigation.goBack()
                            }}
                        >
                            <BackIcon />
                        </TouchableOpacity>
                        <Text style={{ ...FONTS.h3, color: theme.colors.white, fontFamily: fontName.medium }}>{t(AUTH_KEYS.PAY_PEOPLE.PAYEMENT_DETAILS)}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => {

                        }}
                    >
                        <Image
                            source={settingMenu}
                            style={{ width: 15, height: 20, tintColor: theme.colors.white, marginRight: 20 }}
                        />
                    </TouchableOpacity>

                </View>

                <StyleTextView style={{
                    color: theme.colors.white,
                    textAlign: 'left',
                    fontSize: fontSize.textSmall,
                    fontFamily: fontName.medium,
                    letterSpacing: 1,
                    marginLeft: 50,
                    marginBottom: 10
                }} value={`${'Initiated by'} ${params.initiatorName} ${'at'} ${new Date(fin.txnDate).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true
                })}`}></StyleTextView>
                {params.authorizerRemarks !== null ? params.authorizerRemarks.split("~").filter(v => v !== 'null').map(v => {
                    return (
                        <StyleTextView value={`${v}`}
                            style={{
                                color: theme.colors.white,
                                textAlign: 'left',
                                fontSize: fontSize.textSmall,
                                fontFamily: fontName.medium,
                                letterSpacing: 1,
                                marginLeft: 50,
                                marginBottom: 10

                            }} />
                    )
                }) : null}
                {params.pendingAuthCount !== 0 && <StyleTextView style={{
                    color: theme.colors.white,
                    textAlign: 'left',
                    fontSize: fontSize.textNormal,
                    fontFamily: fontName.regular,
                    letterSpacing: 1,
                    marginLeft: 50,
                    opacity: 0.5,
                    marginBottom: 10
                }} value={`${params.pendingAuthCount} ${'approval pending'}`}></StyleTextView>}

                {params.mandatoryAuthCount !== 0 && (<StyleTextView style={{
                    color: theme.colors.white,
                    textAlign: 'left',
                    fontSize: fontSize.textNormal,
                    fontFamily: fontName.regular,
                    letterSpacing: 1,
                    marginLeft: 50,
                    opacity: 0.5,
                    marginBottom: 10
                }} value={`${params.mandatoryAuthCount} ${'mandtory approval pending'}`}></StyleTextView>)
                }


                {/* <StyleTextView style={{
                    color: theme.colors.lightGreen,
                    textAlign: 'left',
                    fontSize: fontSize.textNormal,
                    fontFamily: fontName.bold,
                    letterSpacing: 1,
                    marginLeft: 50,
                    marginBottom: 20
                }} value={`View history`}></StyleTextView> */}
            </View>
        </LinearGradient>)
    }
    const verifyAuthrequest = useCallback(async (auth) => {
        try {
            let request = {
                "txnId": params.txnId,
                "authRemarks": rejectComent,
                "authType": auth,  //R->Reject ,A-AUTHORIZED
                "profileId": selectedProfileDetails.profileId,

            }
            setLoading(true);
            const response = await Home.paymentAuthVerify(request);
            if (response.otpEnable) {
                navigation.navigate(PAY_PEOPLE.FT_AUTH_OTP_SCREEN, { requestData: request })
            }
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
        [navigation, rejectComent, authSatus]
    );
    const renderDetail = (label, value) => {
        if (value === 'null' || value === null || value === undefined || value == "" || value === 'undefined' || value == '0') {
            return null
        }
        return (<View>
            <View style={{ padding: 10, paddingHorizontal: 15, flexDirection: 'row', marginTop: 10 }}>
                <Text style={{ ...FONTS.body4, color: colors.textColorgrey, textAlign: 'left', width: '50%' }}>{label}</Text>
                <Text style={{ ...FONTS.h3, color: theme.colors.textConfirmation, opacity: 0.9, fontFamily: fontName.medium, width: '50%' }}>{value}</Text>
            </View>
            <View style={{ height: 1, backgroundColor: colors.dividerColor, marginTop: 10, opacity: 0.5 }} />
        </View>)
    }
    function isEnabled() {
        if (rejectComent === "") {
            setRejectCommentError("Please enter reason to reject")
            return false
        }
        else {
            setRejectCommentError("")
            return true
        }

    }
    return (<SafeAreaView
        style={{
            flex: 1,
            width: SIZES.width
        }}
    >


        {/* Header */}
        {renderHeader()}
        {/*IFSC, Branch and City  */}

        <View style={{ backgroundColor: colors.detail_bacgroundColor, flex: 1, paddingTop: 20 }}>
            <ScrollView
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}>
                {/*  */}
                {renderDetail(`${'Destination account'} :`, `${fin.destAccount}`)}
                {renderDetail(`${'Mobile number'} :`, `${nfin.payeeMobile}`)}
                {renderDetail(`${'Source account'} :`, `${fin.srcAccount}`)}
                {renderDetail(`${'Amount'} :`, `${amountFormat(params.amount)}`)}
                {renderDetail(`${'Payment Type'} :`, `${paymentTypes[fin.paymentType]}`)}
                {renderDetail(`${'No. of instalments'} :`, `${fin.numberOfInstallments}`)}
                {renderDetail(`${'Frequency'} :`, `${fin.frequency}`)}
                {renderDetail(`${'Date'} :`, `${formatDate(fin.txnDate)}`)}
                {renderDetail(`${'Transfer Via'} :`, `${transferType[nfin.transferType]}`)}
                {renderDetail(`${'Remarks'} :`, `${fin.remarks}`)}

                {params.status === "P" && <><TouchableOpacity
                    onPress={() => {
                        setReturnCommentVisible(true)
                    }}
                >
                    <StyleTextView style={{
                        padding: 15,
                        color: theme.colors.buttonColor,
                        textAlign: 'left',
                        fontSize: fontSize.header3,
                        fontFamily: fontName.medium,
                        letterSpacing: 1,
                    }} value={"Return transaction"}></StyleTextView>
                </TouchableOpacity>
                    <StyleTextView style={{
                        paddingTop: 20,
                        paddingLeft: 15,
                        color: colors.textColorgrey,
                        fontSize: fontSize.textSmall,
                        fontFamily: fontName.medium,
                        letterSpacing: 1,
                    }} value={'Note : Transactions which are not authorized till 12 : 00 night (IST) will get automatically cancelled'}></StyleTextView>
                </>}
            </ScrollView>
            {params.status === "RN" && (
                <TouchableOpacity
                    style={{  marginBottom: 10, }}
                    onPress={() => {
                        navigation.navigate(PAY_PEOPLE.RE_INITIATE_PAYMENT,{...params,isHistory:false})
                    }}
                ><StyleTextView style={{
                    padding: 15,
                    color: theme.colors.buttonColor,
                    textAlign: 'center',
                    fontSize: fontSize.header3,
                    marginBottom: 20,
                    fontFamily: fontName.medium,
                    letterSpacing: 1,
                }} value={"Re-Initiate"}></StyleTextView></TouchableOpacity>)}
            {params.status === "P" && (<View style={{ width: SIZES.width, flexDirection: 'row' }}>
                <TouchableOpacity
                    style={{ width: '50%', backgroundColor: '#d8d8d8', marginTop: 10, }}
                    onPress={() => {
                        setRejectCommentVisible(true)
                    }}
                >
                    <StyleTextView style={{
                        padding: 15,
                        color: theme.colors.pinkColor,
                        textAlign: 'center',
                        fontSize: fontSize.header3,
                        fontFamily: fontName.medium,
                        letterSpacing: 1,
                    }} value={"Reject"}></StyleTextView>

                </TouchableOpacity>
                <MainButton
                    title={"Approve"}
                    noBorder
                    onPress={() => {
                        setAuthStatus("A");
                        setRejectComment('')
                        verifyAuthrequest("A");
                    }}
                    btnContainerStyle={{ width: "50%" }}
                />
            </View>)

            }


        </View>
        {backPressed && <AlerComponent
            heading="Cancel Transfer?"
            message="If you cancel this transaction now , you will have to start over. Are you sure you want to cancel?"
            cancelButtonTitle="No"
            okButtonTitle="Yes"
            onCancel={() => {
                setbackPressed(false)
            }}
            onSave={() => {
                setbackPressed(false)
                navigation.navigate(PAY_PEOPLE.MENU);
            }}
            outSideOnPress={() => {
                setbackPressed(false)
            }}
        />}
        {isLoading && <LoaderComponent />}
        <AuthCommentComponent
            isVisible={rejectComentVisble}
            title="Reason to rejection"
            subtitle="Are you sure you want to reject this payment ? Please enter a reasons (optional)"
            label="Reason"
            cancelTitle="Cancel"
            rejectComentError={rejectComentError}
            approveTitle="Reject"
            remarks={rejectComent}
            setRemarks={setRejectComment}
            onCancel={() => {
                setRejectCommentVisible(false);
            }}
            onApprove={() => {
                setRejectCommentVisible(false);
                setAuthStatus("R")
                verifyAuthrequest("R")
            }}
            setVisible={setRejectCommentVisible}
        />
        <AuthCommentComponent
            isVisible={returnComentVisble}
            title="Return transaction"
            subtitle="Please enter your comments for returing the transaction"
            label="Add comments"
            cancelTitle="Cancel"
            approveTitle="Send"
            remarks={rejectComent}
            setRemarks={setRejectComment}
            color={theme.colors.buttonColor}
            onCancel={() => {
                setReturnCommentVisible(false)
            }}
            onApprove={() => {
                setReturnCommentVisible(false)
                if (isEnabled()) {
                    setRejectCommentVisible(false);
                    setAuthStatus("RN")
                    verifyAuthrequest("RN")
                }
            }}
            setVisible={setReturnCommentVisible}
        />
        {isLoading && <LoaderComponent />}
    </SafeAreaView>)
}
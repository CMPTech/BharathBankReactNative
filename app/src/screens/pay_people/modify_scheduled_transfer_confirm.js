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
import { showMessage } from "react-native-flash-message";
import { AUTH_KEYS } from '../../../assets/translations/constants';
import Home from '../../api/dashboard';
import { useTranslation } from 'react-i18next';
export default function ConfirmScheduledPaymentScreen({ navigation, route }) {
    const { params } = route;
    const { t, i18n } = useTranslation();
    const [isLoading, setLoading] = useState(false);
    const { theme, changeTheme } = useContext(AppContext);
    const [authPriorityEnabled, setAuthPriorityEnabled] = useState(false);
    const [backPressed, setbackPressed] = useState(false)
    const paymentVerifyCall = useCallback(async () => {
        try {
            let request = {
                ...params.requestFT,
            }
            setLoading(true);
            const response = await Home.modifyOrCancelScheduledTxnCall(request);
            if (response.otpEnabled) {
                navigation.navigate(PAY_PEOPLE.MODIFY_SCHEDULED_TXN_OTP, { requestData: params.requestFT })

            }
            else {
                fTConfirm();
            }

            setLoading(false);
        } catch (error) {
            setLoading(false);
            showMessage({
                message: "Fund Transfer",
                description: error.message || error.error || '',
                type: "danger",
                hideStatusBar: true,
                backgroundColor: "black", // background color
                color: "white", // text color
            });
        }
    },
        [navigation,]
    );
    const fTConfirm = useCallback(async () => {
        try {

            setLoading(true);
            let request = {
                ...params.requestFT,
            }
            request.otp = '123456'
            const response = await Home.modifyOrCancelScheduledTxnConfirmCall(request)
            navigation.navigate(PAY_PEOPLE.FT_SUCCESS_SCREEN, response)
            setLoading(false);
        } catch (error) {
            setLoading(false);
            showMessage({
                message: "Fund Transfer",
                description: error.message || error.error,
                type: "danger",
                hideStatusBar: true,
                backgroundColor: "black", // background color
                color: "white", // text color
            });
        }
    },
        [navigation]
    );
    const renderHeader = () => {
        return (<LinearGradient
            useAngle={true}
            angle={170}
            style={{ padding: 10 }}
            angleCenter={{ x: 0.5, y: 0.5 }}
            colors={["#4370e7", "#4370e7", "#479ae8", "#4ad4e8"]}>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <TouchableOpacity
                        style={{ alignItems: 'center' }}
                        onPress={() => {
                            setbackPressed(true)
                        }}
                    >
                        <BackIcon />
                    </TouchableOpacity>
                    <Text style={FONTS.headerText}>{t(AUTH_KEYS.FUND_TRANSFER.CONFIRMATION)}</Text>
                </View>
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack();
                    }}
                >
                    <Text style={{ ...FONTS.h3, color: theme.colors.lightGreen, fontFamily: fontName.medium, marginRight: 20 }}>{t(AUTH_KEYS.FUND_TRANSFER.MODIFY)}</Text>
                </TouchableOpacity>


            </View>
        </LinearGradient>)
    }
    const renderDetail = (label, value) => {
        if (value === 'null' || value === 'undefined' || value == "" || value === null || value === undefined) {
            return null
        }
        return (<View>
            <View style={{ padding: 10, flexDirection: 'row', marginTop: 10 }}>
                <Text style={{ ...FONTS.body4, color: colors.textColorgrey, textAlign: 'left', width: '50%' }}>{label}</Text>
                <Text style={{ ...FONTS.h3, color: theme.colors.textConfirmation, opacity: 0.8, fontFamily: fontName.medium, width: '50%' }}>{value}</Text>
            </View>
            <View style={{ height: 1, backgroundColor: colors.dividerColor, marginTop: 10, opacity: 0.5 }} />
        </View>)
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

        <View style={{ backgroundColor: colors.detail_bacgroundColor, flex: 1, paddingHorizontal: 15, paddingTop: 20 }}>
            <Text style={{ color: theme.colors.textConfirmation, fontFamily: fontName.medium, opacity: 0.7, marginTop: 10, fontSize: fontSize.header3, textAlign: 'center' }}>{t(AUTH_KEYS.FUND_TRANSFER.CONFIRMATION_DESCRIPTION)}</Text>
            <ScrollView
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}>
                {/*  */}
                {renderDetail(`${t(AUTH_KEYS.FUND_TRANSFER.DESTINATION_ACCOUNT)} :`, `${params.destAccount}`)}
                {renderDetail(`${t(AUTH_KEYS.REGISTER.MOBILE_NUMBER)} :`, `${params.mobileNo}`)}
                {renderDetail(`${t(AUTH_KEYS.FUND_TRANSFER.SOURCE_ACCOUNT)} :`, `${params.srcAccount}`)}
                {renderDetail(`${t(AUTH_KEYS.FUND_TRANSFER.AMOUNT)} :`, `${amountFormat(params.amount)}`)}
                {renderDetail(`${t(AUTH_KEYS.FUND_TRANSFER.PAYMENT_TYPE)} :`, `${params.paymentType}`)}
                {renderDetail(`${t(AUTH_KEYS.FUND_TRANSFER.NO_OF_INSTALMENT)} :`, `${params.noInstallment}`)}
                {renderDetail(`${t(AUTH_KEYS.FUND_TRANSFER.FREQUENCY)} :`, `${params.frequencyType}`)}
                {renderDetail(`${t(AUTH_KEYS.FUND_TRANSFER.DATE)} :`, `${params.startDate}`)}
                {renderDetail(`${t(AUTH_KEYS.FUND_TRANSFER.SEND_VIA)} :`, `${params.sendVia}`)}
                {renderDetail(`${t(AUTH_KEYS.FUND_TRANSFER.REMARKS)} :`, `${params.remarks}`)}

            </ScrollView>
            <MainButton
                containerStyle={{ width: SIZES.width }}
                title={t(AUTH_KEYS.FUND_TRANSFER.PROCEED)}
                onPress={() => {
                    paymentVerifyCall();
                }}
            />

        </View>
        {backPressed && <AlerComponent
            heading={t(AUTH_KEYS.FUND_TRANSFER.FUND_TRANSFER_ALERT_CANCEL)}
            message={t(AUTH_KEYS.FUND_TRANSFER.FUND_TRANSFER_ALERT_MSG)}
            cancelButtonTitle={t(AUTH_KEYS.FUND_TRANSFER.FUND_TRANSFER_ALERT_NO)}
            okButtonTitle={t(AUTH_KEYS.FUND_TRANSFER.FUND_TRANSFER_ALERT_YES)}
            onCancel={() => {
                setbackPressed(false)
            }}
            onSave={() => {
                setbackPressed(false)
                navigation.pop(2)
            }}
            outSideOnPress={() => {
                setbackPressed(false)
            }}
        />}
        {isLoading && <LoaderComponent />}
    </SafeAreaView>)
}
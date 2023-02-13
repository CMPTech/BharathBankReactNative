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
import { HOME, PAY_PEOPLE } from '../../routes';
import { amountFormat } from '../../utils/amount-util';
import { showMessage } from "react-native-flash-message";
import Home from '../../api/dashboard';
export default function ReinitiateConfirmScreen({ navigation, route }) {
    const { params } = route;
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
            let response = ""
            if (params.isHistory) {
                response = await Home.FTVerifyApiCall(request)
            }
            else {
                response = await Home.reInitiateVerifyApiCall(request);
            }
            if (response.otpEnabled) {
                navigation.navigate(PAY_PEOPLE.RE_INITIATE_OTP, { requestData: params.requestFT, isHistory: params.isHistory })
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
            request.nfin.otp = '123456'
            let response = ""
            if (params.isHistory) {
                response = await Home.FTConfirmApiCall(request)
            }
            else {
                response = await Home.ReInitiateConfirmApiCall(request)
            }

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
                    <Text style={FONTS.headerText}>{'Confirmation'}</Text>
                </View>
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack();
                    }}
                >
                    <Text style={{ ...FONTS.h3, color: theme.colors.lightGreen, fontFamily: fontName.medium, marginRight: 20 }}>{'Modify'}</Text>
                </TouchableOpacity>


            </View>
        </LinearGradient>)
    }
    const renderDetail = (label, value) => {
        if (value === null || value === undefined || value == "" || value == "0") {
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
            <Text style={{ color: theme.colors.textConfirmation, fontFamily: fontName.medium, opacity: 0.7, marginTop: 10, fontSize: fontSize.header3, textAlign: 'center' }}>{'Please check the payment details carefully, before you proceed'}</Text>
            <ScrollView
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}>
                {/*  */}
                {renderDetail(`${'Destination account'} :`, `${params.destAccount}`)}
                {renderDetail(`${'Mobile number'} :`, `${params.mobileNo}`)}
                {renderDetail(`${'Source account'} :`, `${params.srcAccount}`)}
                {renderDetail(`${'Amount'} :`, `${amountFormat(params.amount)}`)}
                {renderDetail(`${'Payment Type'} :`, `${params.paymentType}`)}
                {renderDetail(`${'No. of instalments'} :`, `${params.noInstallment}`)}
                {renderDetail(`${'Frequency'} :`, `${params.frequencyType}`)}
                {renderDetail(`${'Date'} :`, `${params.startDate}`)}
                {renderDetail(`${'Transfer Via'} :`, `${params.sendVia}`)}
                {renderDetail(`${'Remarks'} :`, `${params.remarks}`)}

            </ScrollView>
            <MainButton
                containerStyle={{ width: SIZES.width }}
                title="Proceed"
                onPress={() => {
                    paymentVerifyCall();
                }}
            />

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
    </SafeAreaView>)
}
import React, { useState, useContext, useEffect, useCallback } from 'react';
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
import { LoaderComponent, BottomButton, AlerComponent } from '../../components';
import { PAY_PEOPLE } from '../../routes';
import Home from '../../api/dashboard';
import { showMessage } from "react-native-flash-message";
import { useSelector } from 'react-redux';
import { profileSelector } from '../../store/selectors';
import { AUTH_KEYS } from '../../../assets/translations/constants';
import { t } from 'i18next';
export default function ConfirmAddPayeeScreen({ navigation, route }) {
    const { params } = route;
    const { theme, changeTheme } = useContext(AppContext);
    const [backPressed, setbackPressed] = useState(false);
    const selectedProfileDetails = useSelector(profileSelector);
    const [isLoading, setLoading] = useState(false);
    const confirmAddPayee = useCallback(async () => {
        if (params.response.otpEnable) {
            let request = {
                "payeeNickName": params.payeeName,
                "payeeAccountNo": params.accountNumber,
                "active": "Y",
                "ifscCode": params.ifscNumber,
                "branchName": params.item.branchName,
                "bankName": params.item.bankName,
                "favorites": "N",
                "profileId": selectedProfileDetails.profileId,
            }
            navigation.navigate(PAY_PEOPLE.ADD_PAYEE_OTP, { requestData: request,...params })
        }
        else {
            try {
                setLoading(true)
                let request = {
                    "payeeNickName": params.payeeName,
                    "payeeAccountNo": params.accountNumber,
                    "active": "Y",
                    "ifscCode": params.ifscNumber,
                    "branchName": params.item.branchName,
                    "bankName": params.item.bankName,
                    "favorites": "N",
                    "profileId": selectedProfileDetails.profileId,
                }
                const response = await Home.confirmAddPayee(request);
                navigation.navigate(PAY_PEOPLE.PAY_PEOPLE_SUCCESS, {
                    message: `${params.payeeName} ${t(AUTH_KEYS.PAY_PEOPLE.ADDED_SUCCESSFULLY)}`, subMessage: `${t(AUTH_KEYS.PAY_PEOPLE.YOU_CAN_PAY_NOW)} ${params.payeeName} ${t(AUTH_KEYS.PAY_PEOPLE.WHENEVER_YOU_WANT)}`, Payee: {
                        "activeStatus": "Y",
                        "bankBranch": params.item.branchName,
                        "bankName": params.item.bankName,
                        "createdBy": selectedProfileDetails.profileId,
                        "favourite": "N",
                        "ifscCode": params.ifscNumber,
                        "payeeAccountNo": params.accountNumber,
                        "payeeNickName": params.payeeName,
                    }
                })
                setLoading(false)
            }
            catch (error) {
                setLoading(false);
                showMessage({
                    message: "",
                    description: error.message,
                    type: "danger",
                    hideStatusBar: true,
                    backgroundColor: "black", // background color
                    color: "white", // text color
                });
            }
        }


    }, [navigation])
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
                justifyContent: 'space-between',
                marginBottom: 10
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <TouchableOpacity
                        style={{ alignItems: 'center', marginLeft: 10 }}
                        onPress={() => {
                            setbackPressed(true)
                        }}
                    >
                        <BackIcon />
                    </TouchableOpacity>
                    <Text style={{ ...FONTS.h3, color: theme.colors.white, fontFamily: fontName.medium }}>{t(AUTH_KEYS.FUND_TRANSFER.CONFIRMATION)}</Text>
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
        if (value === null || value === undefined) {
            return null
        }
        return (<>
            <View style={{ padding: 10, flexDirection: 'row', marginTop: 10 }}>
                <Text style={{ ...FONTS.body3, color: colors.textColorgrey, textAlign: 'left', width: '50%' }}>{label}</Text>
                <Text style={{ ...FONTS.h3, color: theme.colors.textConfirmation, opacity: 0.8, fontFamily: fontName.medium, width: '50%' }}>{value}</Text>

            </View>
            <View style={{ height: 0.5, opacity: 0.5, backgroundColor: colors.dividerColor, marginTop: 10 }} />
        </>)
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
        <View style={{ backgroundColor: colors.detail_bacgroundColor, height: SIZES.height / 2, flex: 1, paddingHorizontal: 15, paddingTop: 20 }}>
            <Text style={{ color: theme.colors.textConfirmation, fontFamily: fontName.medium, opacity: 0.9, marginTop: 10, fontSize: fontSize.header3, textAlign: 'center', opacity: 0.8 }}>{t(AUTH_KEYS.PAY_PEOPLE.ADD_PAYEE_CONFIRMATION_DES)}</Text>
            <ScrollView
                showsVerticalScrollIndicator={false}>
                {/*  */}
                {renderDetail(`${t(AUTH_KEYS.PAY_PEOPLE.PAYEE_DETAILS_FULL_NAME)} :`, `${params.payeeName}`)}
                {renderDetail(`${t(AUTH_KEYS.PAY_PEOPLE.PAYEE_DETAILS_ACC_NO)} :`, `${params.accountNumber}`)}
                {renderDetail(`${t(AUTH_KEYS.PAY_PEOPLE.PAYEE_DETAILS_BANK_NAME)} :`, `${params?.item?.bankName}`)}
                {renderDetail(`${t(AUTH_KEYS.PAY_PEOPLE.PAYEE_DETAILS_IFSC_CODE)} :`, `${params.ifscNumber}`)}
                {renderDetail(`${t(AUTH_KEYS.PAY_PEOPLE.BRANCH_NAME)} :`, `${params?.item?.branchName}`)}

            </ScrollView>
            <BottomButton
                title={t(AUTH_KEYS.PAY_PEOPLE.ADD_PAYEE)}
                onPress={confirmAddPayee}
            />
        </View>
        {backPressed && <AlerComponent
            heading="Quit adding this payee ?"
            message="If you quit now  you will have to start all over again."
            cancelButtonTitle="Cancel"
            okButtonTitle="Quit"
            onCancel={() => {
                setbackPressed(false)
            }}
            onSave={() => {
                setbackPressed(false)
                navigation.navigate(PAY_PEOPLE.MENU)
            }}
            outSideOnPress={() => {
                setbackPressed(false)
            }}
        />}
        {isLoading && <LoaderComponent />}
    </SafeAreaView>)
}
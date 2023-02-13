import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView, FlatList,
    Share,
    Image,
    ImageBackground
} from 'react-native';
import { fontName, fontSize, FONTS, SIZES, currencyValue, colors } from "../../../../styles/global.config";
import { imageBackground } from '../../../../assets/images';
import {
    setting,
    shareIcon
} from '../../../../assets/icons';
import { BackIcon, Logo } from '../../../../assets/svg'
import { t } from "i18next";
import { AUTH_KEYS } from '../../../../assets/translations/constants';
import { ACCOUNTS } from '../../../routes';
import { amountFormat, currencyFormat } from '../../../utils/amount-util';
import ShowAmountFormat from '../../../components/base/ShowAmountFormat';
export default function LoanAccountDetailsScreen({ navigation, route }) {
    const { params } = route;
    const renderHeader = () => {
        return (
            <View
                style={{
                    marginTop: 20,
                }}>

                <TouchableOpacity
                    style={{ alignItems: 'center', marginHorizontal: 10 }}
                    onPress={() => {
                        navigation.goBack()

                    }}
                >
                    <BackIcon />
                </TouchableOpacity>
            </View>)

    }
    const renderAccountBody = ({ accountItem }) => {
        return (<View style={{ marginTop: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <Text style={{ ...FONTS.body3, color: colors.textColorWhite, padding: 2, color: colors.textColorWhite }}>{t(AUTH_KEYS.MAIN_SCREEN.CURRENT_OUTSTANDING)}</Text>
            {/* <Text style={{ ...FONTS.h3, color: colors.textColorWhite, padding: 2, fontFamily: fontName.regular, fontSize: 30, marginVertical: 5 }}>{currencyFormat(accountItem.outstandingAmt, accountItem.acctCcy)}</Text> */}
            <ShowAmountFormat currency={accountItem.acctCcy} amount={accountItem.outstandingAmt} />
            <Text style={{ ...FONTS.h3, color: colors.textColorWhite, padding: 2,  fontFamily: fontName.medium, }}>{` ${accountItem.acctType} ${accountItem.acctNo}`}</Text>
            {/* <Text style={{ ...FONTS.h4, color: colors.textColorWhite, padding: 2, opacity: 0.8 }}>{`${'Account status'} - ${accountItem.acctStatus}`}</Text> */}
        </View>)
    }
    const renderDetail = (label, value) => {
        if (value === null || value === undefined) {
            return null
        }
        return (<>
            <View style={{ padding: 10, flexDirection: 'row', marginTop: 10 }}>
                <Text style={{ ...FONTS.body4, color: colors.textColorgrey, textAlign: 'left', width: '50%' }}>{label}</Text>
                <Text style={{ ...FONTS.h3, color: '#111827', opacity: 0.9, fontFamily: fontName.medium, width: '50%' }}>{value}</Text>

            </View>
            <View style={{ height: 0.5, opacity: 0.5, backgroundColor: colors.dividerColor, marginTop: 10 }} />
        </>)
    }
    return (<ImageBackground
        source={imageBackground}
        style={{
            flex: 1,
            width: '100%'
        }}
    >
        <View style={{ flex: 1, }}>
            <View style={{ height: SIZES.height * 0.3 }}>
                {/* Header */}
                <View style={{ flexDirection: 'row', alignItems: 'center',marginTop:10 }}>
                <TouchableOpacity
                    style={{ alignItems: 'flex-start', marginHorizontal: 10, }}
                    onPress={() => {
                        navigation.goBack()

                    }}
                >
                    <BackIcon />
                </TouchableOpacity>

                <Text style={FONTS.headerText}>{t(AUTH_KEYS.MAIN_SCREEN.LOAN_DETAILS)}</Text>
                </View>
                {/* Accounts Details */}
                {renderAccountBody(params)}
            </View>
            {/*IFSC, Branch and City  */}
            <View style={{ backgroundColor: colors.detail_bacgroundColor, height: SIZES.height / 2, flex: 1, paddingHorizontal: 15, paddingTop: 20 }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}>
                    {/*  */}
                    {renderDetail(`${t(AUTH_KEYS.MAIN_SCREEN.INTEREST_RATE)} :`, `${params.accountItem.interestRate}%`)}
                    {renderDetail(`${t(AUTH_KEYS.MAIN_SCREEN.SANCTIONED_AMOUNT)} :`, amountFormat(params.accountItem.sanctionedAmt, params.accountItem.acctCcy))}
                    {renderDetail(`${t(AUTH_KEYS.MAIN_SCREEN.DISBURSED_AMOUNT)} :`, amountFormat(params.accountItem.disbursedAmt, params.accountItem.acctCcy))}
                    {renderDetail(`${t(AUTH_KEYS.MAIN_SCREEN.SCHEME_NAME)} :`, `${params.accountItem.schmName}`)}
                    {renderDetail(`${t(AUTH_KEYS.MAIN_SCREEN.OPEN_DATE)} :`, params.accountItem.acctOpenDate)}
                    {renderDetail(`${t(AUTH_KEYS.MAIN_SCREEN.LOAN_PERIOD)} :`, `${params.accountItem.tenureMonths === '0' ? '' : params.accountItem.tenureMonths + ' ' + 'Months'} ${params.accountItem.tenureDays === '0' ? '' : params.accountItem.tenureDays + ' ' + 'Days'}`)}
                </ScrollView>
            </View>
        </View>
    </ImageBackground>)
}
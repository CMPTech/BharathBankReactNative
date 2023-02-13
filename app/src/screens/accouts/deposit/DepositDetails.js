import React, { useContext, useState } from 'react';
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
    settingMenu,
    shareIcon
} from '../../../../assets/icons';
import { BackIcon, Logo } from '../../../../assets/svg'
import { t } from "i18next";
import { AUTH_KEYS } from '../../../../assets/translations/constants';
import { ACCOUNTS } from '../../../routes';
import { amountFormat, currencyFormat } from '../../../utils/amount-util';
import ShowAmountFormat from '../../../components/base/ShowAmountFormat';
import { ThemeColors } from 'react-navigation';
import { AppContext } from '../../../../themes/AppContextProvider';

export default function DepositAccountDetailsScreen({ navigation, route }) {
    const { params } = route;

    const { theme, changeTheme } = useContext(AppContext);

    const shareOptions = {
        title: 'BCB',
        message: `${'A/c Name:'} - ${params.accountItem.acctName}
        ${'\nA/c No:'} - ${params.accountItem.acctNo}
        ${'\nA/c Type:'} - ${params.accountItem.acctType}
        ${'\nIFSC'} - ${params.accountItem.ifsc}
        ${'\nBank name'} - ${"Bharat Co-operative Bank (Mumbai) Limited"}
        ${'\nBranch name'} - ${params.accountItem.acctBranchDesc}`,
        subject: 'Account Details'
    };
    const renderHeader = () => {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    marginTop: 20,
                    alignItems: 'center',
                    justifyContent: 'space-between'
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
                    <Text style={{
                        ...FONTS.headerText,
                        // fontSize: fontSize.header2,
                        // fontFamily: fontName.medium,
                        // color: colors.textColorWhite, fontFamily: fontName.medium, textAlign: 'left'
                    }}>{t(AUTH_KEYS.MAIN_SCREEN.DEPOSIT_DETAILS)}</Text>
                </View>

                <TouchableOpacity style={{ justifyContent: 'flex-end' }}>
                    <Image
                        style={{ width: 20, height: 20, marginRight: 20, tintColor: 'white' }}
                        source={settingMenu}
                    />
                </TouchableOpacity>
            </View>)

    }
    const renderAccountBody = ({ accountItem }) => {
        return (<View style={{ marginTop: '5%', alignItems: 'center', justifyContent: 'center', marginBottom: '10%' }}>
            <Text style={{ ...FONTS.body3, color: colors.textColorWhite, padding: 2, color: colors.textColorWhite }}>{t(AUTH_KEYS.MAIN_SCREEN.PRESENT_BALANCE)}</Text>
            <ShowAmountFormat currency={accountItem.acctCcy} amount={accountItem.availableBalance} />
            {/* <Text style={{ ...FONTS.h3, color: colors.textColorWhite, padding: 2, fontFamily: fontName.regular, fontSize: 30, marginVertical: 5 }}>{currencyFormat(accountItem.availableBalance, accountItem.acctCcy)}</Text> */}
            <Text style={{ ...FONTS.h3, color: colors.textColorWhite, padding: 2, fontFamily: fontName.medium, }}>{`${accountItem.acctType} ${accountItem.acctNo}`}</Text>
            {/* <Text style={{ ...FONTS.h4, color: colors.textColorWhite, padding: 2, opacity: 0.8 }}>{`${'Account status'} - ${accountItem.acctStatus}`}</Text> */}
        </View>)
    }
    const renderDetail = (label, value) => {
        if (value === null || value === undefined) {
            return null
        }
        return (<>
            <View style={{ padding: 10, flexDirection: 'row', marginTop: 10 }}>
                <Text style={{ ...FONTS.body4, color: colors.textColor, textAlign: 'left', width: '50%' }}>{label}</Text>
                <Text style={{ ...FONTS.h3, color: theme.colors.textColor, fontFamily: fontName.medium, width: '50%' }}>{value}</Text>

            </View>
            <View style={{ height: 1, opacity: 0.2, backgroundColor: colors.dividerColor, marginTop: 10 }} />
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
            <View>
                {/* Header */}
                {renderHeader()}
                {/* Accounts Details */}
                {renderAccountBody(params)}
            </View>
            {/*IFSC, Branch and City  */}
            <View style={{ backgroundColor: colors.detail_bacgroundColor, height: SIZES.height / 2, flex: 1, paddingHorizontal: 15, paddingTop: 20 }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}>
                    {/*  */}
                    {renderDetail(`${t(AUTH_KEYS.MAIN_SCREEN.DATE_OF_FD)} :`, params.accountItem.acctOpenDate)}
                    {renderDetail(`${t(AUTH_KEYS.MAIN_SCREEN.PRINCIPAL_AMOUNT)} :`, amountFormat(params.accountItem.cumulaPrinicpalAmt, params.accountItem.acctCcy))}
                    {renderDetail(`${t(AUTH_KEYS.MAIN_SCREEN.MATURITY_AMOUNT)} :`, amountFormat(params.accountItem.maturityAmt, params.accountItem.acctCcy))}
                    {renderDetail(`${t(AUTH_KEYS.MAIN_SCREEN.RATE_OF_INTEREST)} :`, `${params.accountItem.interestRate}%`)}
                    {renderDetail(`${t(AUTH_KEYS.MAIN_SCREEN.MATURES_ON)} :`, params.accountItem.maturityDate)}
                    {renderDetail(`${t(AUTH_KEYS.MAIN_SCREEN.DEPOSIT_DETAILS_TENURE)} :`, `${params.accountItem.depositMonths === '0' ? '' : params.accountItem.depositMonths + ' ' + t(AUTH_KEYS.MAIN_SCREEN.DEPOSIT_MONTHS)} ${params.accountItem.depositDays === '0' ? '' : params.accountItem.depositDays + ' ' + 'Days'} `)}
                    <Text style={{ color: colors.textColorgrey, fontFamily: fontName.medium, opacity: 0.6, marginTop: 10 }}>{t(AUTH_KEYS.MAIN_SCREEN.DEPOSITS_DESCRIPTION)}</Text>
                </ScrollView>
            </View>
        </View>
    </ImageBackground>)
}
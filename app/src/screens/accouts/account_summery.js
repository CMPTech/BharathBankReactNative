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
import { fontName, fontSize, FONTS, SIZES } from "../../../styles/global.config";
import { imageBackground } from '../../../assets/images';
import {
    setting,
    settingMenu,
    shareIcon
} from '../../../assets/icons';
import { BackIcon, Logo } from "../../../assets/svg";
import { AUTH_KEYS } from '../../../assets/translations/constants'
import { useTranslation } from 'react-i18next'
import { ACCOUNTS } from '../../routes';
import { AppContext } from '../../../themes/AppContextProvider';
import { bcbAmountView, currencyFormat } from '../../utils/amount-util';
import ShowAmountFormat from '../../components/base/ShowAmountFormat';
import { BottomButton, MainButton } from '../../components';
export default function AccountSummeryScreen({ navigation, route }) {
    const { params } = route;
    const { t, i18n } = useTranslation()
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
                    marginTop: 10,
                    alignItems: 'center',
                    //justifyContent: 'space-between'
                }}>
                <TouchableOpacity
                    style={{ alignItems: 'center', marginLeft: 10 }}
                    onPress={() => {
                        navigation.goBack()

                    }}
                >
                    <BackIcon />
                </TouchableOpacity>
                <Text style={FONTS.headerText}>{t(AUTH_KEYS.MAIN_SCREEN.ACCOUNT_SUMMARY)}</Text>
                <TouchableOpacity style={{ position: 'absolute', right: 10 }}>
                    <Image
                        source={settingMenu}
                        style={{ width: 20, height: 20, tintColor: 'white' }}
                    />
                </TouchableOpacity>
            </View>)

    }
    const renderAccountBody = ({ accountItem }) => {
        return (<View style={{ marginTop: '10%', alignItems: 'center', justifyContent: 'center', marginBottom: '10%' }}>
            <Text style={{ ...FONTS.body3, color: theme.colors.white, padding: 2, }}>{t(AUTH_KEYS.MAIN_SCREEN.AVAILABLE_BALANCE)}</Text>
            <ShowAmountFormat currency={accountItem.acctCcy} amount={accountItem.availableBalance} />
            {/* <Text style={{ ...FONTS.h3, color: theme.colors.white, padding: 2, fontFamily: fontName.regular, fontSize: 30, marginVertical: '1%' }}>{currencyFormat(accountItem.availableBalance, accountItem.acctCcy)}</Text> */}
            <Text style={{ ...FONTS.body3, color: theme.colors.white, padding: 2, }}>{`${accountItem.acctType}  ${accountItem.acctNo}`}</Text>
            <Text style={{ ...FONTS.body3, color: theme.colors.white, padding: 2, marginTop: '1%' }}>{`${t(AUTH_KEYS.MAIN_SCREEN.ACTIVE_STATUS)} - ${accountItem.acctStatus}`}</Text>
        </View>)
    }
    const renderDetail = (label, value) => {
        if (value === null || value === undefined) {
            return null
        }
        return (<View style={{ padding: 10,paddingBottom:0 }}>
            <Text style={{ ...FONTS.body4, color: theme.colors.textColor, }}>{label}</Text>
            <Text style={{ ...FONTS.h3, color: theme.colors.textColor, marginTop: 10 }}>{value}</Text>
        </View>)
    }
    return (
        <ImageBackground
            source={imageBackground}
            style={{
                flex: 1,
                width: '100%'
            }}
        >
            <View style={{ flex: 1 }}>
                {/* Header */}
                {renderHeader()}
                {/* Accounts Details */}
                {renderAccountBody(params)}
                {/*IFSC, Branch and City  */}
                <View style={{ backgroundColor: theme.colors.bgColor, flex: 1, paddingHorizontal: 15, paddingTop: 20 }}>
                    {/*  */}
                    {renderDetail(t(AUTH_KEYS.PAY_PEOPLE.BRANCH_NAME), params.accountItem.acctBranchDesc)}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginRight: '20%' }}>
                        {renderDetail(t(AUTH_KEYS.PAY_PEOPLE.PAYEE_DETAILS_IFSC_CODE), params.accountItem.ifsc)}
                        {renderDetail(t(AUTH_KEYS.PAY_PEOPLE.CITY), params.accountItem.city)}
                    </View>

                    {/* Share Button */}
                    <TouchableOpacity
                        style={{ flexDirection: 'row', padding: 10, marginRight: 10, marginTop: 10 }}
                        onPress={() => {
                            Share.share(shareOptions)
                        }}>
                        <Image
                            style={{ tintColor: '#347AF0', width: 25, height: 25 }}
                            source={shareIcon}
                        />
                        <Text style={{ ...FONTS.h3, color:'#347AF0', marginLeft: 10, alignSelf: 'center' ,fontFamily:fontName.medium}}>{t(AUTH_KEYS.MAIN_SCREEN.SHARE_DETAILS)}</Text>
                    </TouchableOpacity>

                </View>
                {/* render ministatement Button */}

                <BottomButton title={t(AUTH_KEYS.PAY_PEOPLE.VIEW_MINI_STATEMENT)}
                    onPress={() => {
                        navigation.navigate(ACCOUNTS.MINI_STATEMENT, { accountItem: params.accountItem })

                    }} />

            </View>
        </ImageBackground>)
}

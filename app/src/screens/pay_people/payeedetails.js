import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    FlatList,
    Image
} from 'react-native';
import {
    favioritIcon,
    favioritSelectedIcon,
    deleteIcon
  } from '../../../assets/icons';
import { fontName, fontSize, FONTS, SIZES, currencyValue, colors } from "../../../styles/global.config";
import { BackIcon } from '../../../assets/svg';
import LinearGradient from 'react-native-linear-gradient';
import { AppContext } from "../../../themes/AppContextProvider";
import { SearchComponent } from '../../components';
import { useTranslation } from 'react-i18next';
import { AUTH_KEYS } from '../../../assets/translations/constants';

export default function PayeeDetailsScreen({ navigation, route , item}) {
    const { t, i18n } = useTranslation();
    const {params}=route;
    const { theme, changeTheme } = useContext(AppContext)
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
                marginBottom: 10
            }}>
                
                <TouchableOpacity
                    style={{ alignItems: 'center', marginLeft: 10 }}
                    onPress={() => {
                        navigation.goBack()

                    }}
                >
                    <BackIcon />
           
                </TouchableOpacity>
                <Text style={{ ...FONTS.h2, color: '#FFF', fontFamily: fontName.medium,marginLeft:15 }}>{t(AUTH_KEYS.PAY_PEOPLE.PAYEE_DETAILS_TITLE)}</Text>
                <TouchableOpacity>
                {/* <Image
            source={ deleteIcon}
            style={{  width: 25, height: 25, marginHorizontal: 10 , marginLeft:180}}
          /> */}
          </TouchableOpacity>
            </View>
        </LinearGradient>)
    }
    const RenderDetail = ({label, value,item}) => {
        if (value === null || value === undefined) {
            return null
        }
        return (<>
            <View style={{ padding: 10, flexDirection: 'column', marginTop: 10 }}>
                <Text style={{ ...FONTS.body4, color: colors.textColorgrey, textAlign: 'left', width: '50%' }}>{label}</Text>
                <Text style={{ ...FONTS.h2,marginTop:5, color: theme.colors.textConfirmation, opacity: 0.9, fontFamily: fontName.medium, width: '50%' }}>{value}</Text>
               
            </View>
            <View style={{ height: 1, opacity: 0.5, backgroundColor: colors.dividerColor, marginTop: 10 }} />
        </>)
    }
    return (<View
        style={{
            flex: 1,
            width: SIZES.width
        }}
    >
        {renderHeader()}
        <View style={{ backgroundColor: colors.detail_bacgroundColor, height: SIZES.height / 2, flex: 1, paddingHorizontal: 15, paddingTop: 20 }}>

        <ScrollView
                showsVerticalScrollIndicator={false}>
                    

          
            <RenderDetail
              label={t(AUTH_KEYS.PAY_PEOPLE.PAYEE_DETAILS_FULL_NAME)}
              value={params.item.payeeNickName}
            />
            <RenderDetail
              label={t(AUTH_KEYS.PAY_PEOPLE.PAYEE_DETAILS_ACC_NO)}
              value={params.item.payeeAccountNo}
            />
            <RenderDetail
              label={t(AUTH_KEYS.PAY_PEOPLE.PAYEE_DETAILS_BANK_NAME)}
              value={params.item.bankName}
            />
            <RenderDetail
              label={t(AUTH_KEYS.PAY_PEOPLE.PAYEE_DETAILS_IFSC_CODE)}
              value={params.item.ifscCode}
            />
  </ScrollView>
        </View>
    </View>)
}
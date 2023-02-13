import React, { useEffect, useContext, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Platform,
  Animated
} from "react-native";
import { fontName, fontSize } from "../../../styles/global.config";
import { AppContext } from "../../../themes/AppContextProvider";
import TitleText from "../../components/base/TitleText";
import MainButton from "../../components/button/MainButton";
import { REGISTER, LOCATION, CALL_US, AUTH, FAQS, HOME, PAY_PEOPLE } from "../../routes";
import { useTranslation } from 'react-i18next';
import { AUTH_KEYS } from '../../../assets/translations/constants';
import { timeOutIcon } from "../../../assets/icons";



export default function SessionExpiredScreen({ navigation, route }) {
  const { t, i18n } = useTranslation();


  return (

    <View style={{ flex: 1, marginTop: 30 }}>

      <Image

        source={timeOutIcon}
        style={{ width: 85, height: 95, marginTop: 110, marginBottom: 20, marginHorizontal: 150 }}
      />

      <View style={{
        alignContent: 'center',
        alignItems: 'center',

        padding: 20,

      }}>

        <TitleText title={t(AUTH_KEYS.WEL_COME.SESSION_EXPIRED)}
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            fontFamily: fontName.light,
            textAlign: 'center',
            marginBottom: 25,

          }} />

        <Text

          style={{
            fontSize: 16,


            textAlign: 'center',
            marginBottom: 25,

          }}
        >

          {t(AUTH_KEYS.WEL_COME.SESSION_EXPIRED_MSG)}

        </Text>

        <Text
          style={{
            fontSize: 16,


            textAlign: 'center',
            marginBottom: 25,

          }}
        >

          {t(AUTH_KEYS.WEL_COME.LOGIN_AGAIN)}

        </Text>
        <MainButton btnContainerStyle={{ paddingLeft: 25, paddingRight: 25, paddingTop: -25, paddingBottom: -20 }}
          title={t(AUTH_KEYS.WEL_COME.LOGIN)} onPress={() => { navigation.navigate(AUTH.M_PIN_LOGIN) }} />

        <Text
          style={{
            fontSize: 16,
            color: "#479ae8",
            marginTop: 20,
            textAlign: 'center',
            marginBottom: 25,

          }}
        >

          {t(AUTH_KEYS.WEL_COME.THANK_YOU)}

        </Text>


      </View>











    </View>
    // </AuthBody>
  );
}



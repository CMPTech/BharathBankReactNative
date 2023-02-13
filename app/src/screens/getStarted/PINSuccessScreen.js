import React, { useContext } from "react";
import {
  View,
  Image,
} from "react-native";
import { fontName, fontSize } from "../../../styles/global.config";
import { AppContext } from "../../../themes/AppContextProvider";
import MainButton from "../../components/button/MainButton";
import StyleTextView from "../../components/input/StyleTextView";
import { AUTH, GET_STARTED, SPLASH } from "../../routes";
import { AUTH_KEYS, } from '../../../assets/translations/constants';
import { useTranslation } from 'react-i18next';
import { store } from "../../store";
import { SET_BIOMETRIC_ENABLED } from "../../store/constants";

export default function PINSuccessScreen({ navigation, route }) {
  const { theme, changeTheme } = useContext(AppContext)
  const { t, i18n } = useTranslation();

  store.dispatch({ type: SET_BIOMETRIC_ENABLED, payload: false });

  return (
    <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center', backgroundColor: theme.colors.white, flex: 1 }}>


      <Image
        style={{ width: 50, height: 50 }}
        source={require('./../../../assets/images/success_animation.gif')} />

      <StyleTextView value={t(AUTH_KEYS.REGISTER.SUCCESS)} style={{
        fontSize: fontSize.header3,
        fontFamily: fontName.semi_bold,
        color: theme.colors.headingTextColor,
        marginTop: 10,
        marginBottom: 10
      }} />


      <StyleTextView value={route?.params?.responseData?.message|| ""} 
      style={{
        fontSize: fontSize.textSmall,
        fontFamily: fontName.regular,
        color: theme.colors.headingTextColor,
        textAlign: 'center',
        marginBottom: 10
      }} />
      <MainButton title={t(AUTH_KEYS.GET_STARTED_TITLE)} onPress={() => { navigation.navigate(SPLASH) }} />

    </View>
  );
}



import React, { useContext, useCallback } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import { fontName, fontSize } from "../../../styles/global.config";
import { AppContext } from "../../../themes/AppContextProvider";
import MainButton from "../../components/button/MainButton";
import StyleTextView from "../../components/input/StyleTextView";
import { AUTH, GET_STARTED, SPLASH, PAY_PEOPLE } from "../../routes";
import { AUTH_KEYS, } from '../../../assets/translations/constants';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { t } from "i18next";
export default function ChequeBookSuccessScreen({ navigation, route }) {
  const { theme, changeTheme } = useContext(AppContext)
  const { params } = route
  const isFocused = useIsFocused();
  const backPressHandler = useCallback(() => {
    if (isFocused) {
      navigation.pop(4)
    }
    return true
  }, [navigation])

  const useBackHandler = (backHandler) => {
    useFocusEffect(() => {
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        backHandler
      )
      return () => subscription.remove()
    })
  }
  useBackHandler(backPressHandler)
  return (
    <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center', backgroundColor: theme.colors.white, flex: 1 }}>

      <TouchableOpacity
        style={{ position: 'absolute', right: 30, top: 30 }}
        onPress={() => {
          navigation.pop(3)
        }}
      >
        <StyleTextView value={t(AUTH_KEYS.MPIN_LOGIN.DONE)} style={{
          fontSize: fontSize.header3,
          fontFamily: fontName.medium,
          color: theme.colors.buttonColor,
          marginTop: 10,
          marginBottom: 10
        }} />


      </TouchableOpacity>
      <Image
        style={{ width: 80, height: 80 }}
        source={require('./../../../assets/images/success_animation.gif')} />

      <StyleTextView value={params?.message || t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.CHEQUE_BOOK_REQUEST_SUCCESS_MSG)} style={{
        fontSize: fontSize.header3,
        fontFamily: fontName.medium,
        color: theme.colors.headingTextColor,
        marginTop: 10,
        marginBottom: 10
      }} />


      <StyleTextView value={params?.subMessage || ""}
        style={{
          fontSize: fontSize.textSmall,
          fontFamily: fontName.regular,
          color: theme.colors.headingTextColor,
          textAlign: 'center',
          marginBottom: 10
        }} />


    </View>
  );
}
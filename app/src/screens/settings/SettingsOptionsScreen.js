import React, { useEffect, useContext } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import { fontName, fontSize } from "../../../styles/global.config";
import LinearGradient from 'react-native-linear-gradient';
import { AppContext } from "../../../themes/AppContextProvider";
import { LogoIcon, SplashScreenIcon } from "../../../assets/svg";
import TitleText from "../../components/base/TitleText";
import { GET_STARTED, SETTINGS } from "../../routes";
import { AuthHeader } from "../../components";
import StyleTextView from "../../components/input/StyleTextView";

export default function SettingsOptionsScreen({ navigation, route }) {

  const { theme, changeTheme } = useContext(AppContext)


  const profileData = route.params.profileData

  return (

    <View style={{
      flex: 1,

    }}>
      <AuthHeader title={'Settings'}
        navigation={navigation} />


      <TouchableOpacity
        onPress={() => { navigation.navigate(SETTINGS.CHANGE_MPIN_1) }} >
        <StyleTextView value={"Change mPIN"}
          style={{
            fontSize: fontSize.textNormal,
            fontFamily: fontName.regular,
            color: theme.colors.grey,
            padding: 15
          }} />
      </TouchableOpacity>
      <View style={{
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: theme.colors.dividerColor,
        opacity: .2
      }} />
      <TouchableOpacity
        onPress={() => navigation.navigate(SETTINGS.TOUCH_ID)} >
        <StyleTextView value={"TouchID access"}
          style={{
            fontSize: fontSize.textNormal,
            fontFamily: fontName.regular,
            color: theme.colors.grey,
            padding: 15
          }} />
      </TouchableOpacity>
      <View style={{
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: theme.colors.dividerColor,
        opacity: .2
      }} />
      <TouchableOpacity
        onPress={() => navigation.navigate(SETTINGS.TRANSACTION_LIMIT, { profileData: profileData })} >
        <StyleTextView value={"Transfer limits"}
          style={{
            fontSize: fontSize.textNormal,
            fontFamily: fontName.regular,
            color: theme.colors.grey,
            padding: 15
          }} />
      </TouchableOpacity>
      <View style={{
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: theme.colors.dividerColor,
        opacity: .2
      }} />
      <TouchableOpacity
        onPress={() => { }} >
        <StyleTextView value={"Security questions"}
          style={{
            fontSize: fontSize.textNormal,
            fontFamily: fontName.regular,
            color: theme.colors.grey,
            padding: 15
          }} />
      </TouchableOpacity>
      <View style={{
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: theme.colors.dividerColor,
        opacity: .2
      }} />
      <TouchableOpacity
        onPress={() => navigation.navigate(SETTINGS.SET_PRIMARY_ACCOUNT, { profileData: profileData })} >
        <StyleTextView value={"Set primary account"}
          style={{
            fontSize: fontSize.textNormal,
            fontFamily: fontName.regular,
            color: theme.colors.grey,
            padding: 15
          }} />
      </TouchableOpacity>
      <View style={{
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: theme.colors.dividerColor,
        opacity: .2
      }} />


    </View>

  );
}



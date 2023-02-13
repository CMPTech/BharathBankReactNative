import React, { useEffect, useContext, useState, useCallback } from "react";
import {
  View,
  Text,
  Keyboard,
  TouchableOpacity,
  ImageBackground
} from "react-native";
import { fontName, fontSize } from "../../../../styles/global.config";
import { AppContext } from "../../../../themes/AppContextProvider";
import { useTranslation } from 'react-i18next';
import StyleTextView from "../../../components/input/StyleTextView";
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import { REGISTER, SETTINGS } from "../../../routes";
import { AUTH_KEYS } from '../../../../assets/translations/constants';
import LinearGradient from 'react-native-linear-gradient';
import { BackIcon } from "../../../../assets/svg";
import VirtualKeyboard from 'react-native-virtual-keyboard';
import { AuthHeader } from "../../../components";
import AuthNoGradientHeader from "../../../components/base/AuthNoGradientHeader";
import { imageBackground } from "../../../../assets/images";



import { useIsFocused } from '@react-navigation/native';
export default function ChangemPINSecondScreen({ navigation, route }) {
  const { theme, changeTheme } = useContext(AppContext)
  const { t, i18n } = useTranslation();
  const [disableButton, setDisableButton] = useState(true);
  const [otpValue, setOtpValue] = useState('');


  const requestData = route.params.requestData

  const [confirmOtpValue, setConfirmOtpValue] = useState('');
  const nextStep = useCallback(

    async (data) => {
      try {

        navigation.navigate(REGISTER.PIN_SUCCESS)
      } catch (error) {

      }
    },
    [navigation]
  );


  const isFocused = useIsFocused();

  useEffect(() => {
    // Put Your Code Here Which You Want To Refresh or Reload on Coming Back to This Screen.
    setOtpValue('')
  }, [isFocused]);

  return (
    <LinearGradient
      useAngle={true}
      style={{ flex: 1 }}
      angle={180}
      angleCenter={{ x: 0.5, y: 0.5 }}
      colors={["#4370e7", "#479ae8", "#4ad4e8"]} >

      <ImageBackground
        source={imageBackground}
        style={{ width: "100%", height: "100%" }}
      >

        <AuthNoGradientHeader title={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.ENTER_NEW_PIN)}
          navigation={navigation}
        />


        <Text style={{
          fontSize: fontSize.textNormal,
          fontFamily: fontName.light,
          textAlign: 'center',
          color: theme.colors.white,
          marginTop: 30,
        }}>{t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.ENTER_SIX_DISITS)}</Text>

        <View style={{
          marginTop: '20%',
          alignItems: 'center',
          alignContent: 'center',
        }}>




          <SmoothPinCodeInput
            placeholder={
              <View style={{
                width: 10,
                height: 10,
                borderRadius: 10,
                opacity: 0.3,
                backgroundColor: theme.colors.lightGreen,
              }} />}
            mask={
              <View style={{
                width: 15,
                height: 15,
                borderRadius: 15,
                backgroundColor: theme.colors.lightGreen,
              }} />}
            cellSpacing={1}
            codeLength={6}
            maskDelay={10}
            password={true}
            cellStyle={null}
            cellStyleFocused={null}
            value={otpValue}
            onTextChange={otpValue => {
              setOtpValue(otpValue)
              if (otpValue.length === 6) {
                navigation.navigate(SETTINGS.CHANGE_MPIN_3, {
                  requestData: {
                    ...requestData,
                    newPassword: otpValue
                  }
                })
              } else {
              }
            }
            }
          />
        </View>



        <VirtualKeyboard
          cellStyle={{ marginBottom: 10 }}
          clearOnLongPress={true}
          pressMode='char'
          style={{ position: 'absolute', bottom: 0, width: '80%', marginBottom: '10%' }}
          color='white'
          onPress={(val) => {
            let curText = otpValue;
            // console.log(otpValue)
            if (isNaN(val)) {
              if (val === 'back') {
                curText = curText.slice(0, -1);
              } else if (val === 'clear') {
                curText = "";
              } else {
                curText += val;
              }
            } else {
              curText += val;
            }
            setOtpValue(curText)
            if (curText.length === 6) {
              navigation.navigate(SETTINGS.CHANGE_MPIN_3, {
                requestData: {
                  ...requestData,
                  newPassword: curText
                }
              })
            }
          }
          } />
        <View />
      </ImageBackground>
    </LinearGradient>
  );
}



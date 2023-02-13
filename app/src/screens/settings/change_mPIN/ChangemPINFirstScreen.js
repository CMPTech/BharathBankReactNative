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
import { mPinDataSelector } from "../../../store/selectors";
import { useSelector } from "react-redux";
import { showMessage, hideMessage } from "react-native-flash-message";
import * as CryptoJS from "crypto-js";
import config from "../../../api/constants";


import { useIsFocused } from '@react-navigation/native';
export default function ChangemPINFirstScreen({ navigation, route }) {
  const { theme, changeTheme } = useContext(AppContext)
  const { t, i18n } = useTranslation();
  const [disableButton, setDisableButton] = useState(true);
  const [otpValue, setOtpValue] = useState('');

  const AES_SECRET_KEY = CryptoJS.enc.Utf8.parse(config.constants.NEO_KEY);
  const GCM_SECRET_KEY = CryptoJS.enc.Utf8.parse(config.constants.GCM_KEY);
  const mpinData = useSelector(mPinDataSelector)


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


  // const encryptAES = (text) => {
  //   return CryptoJS.AES.encrypt(text, AES_SECRET_KEY, {
  //     mode: CryptoJS.mode.ECB,
  //     padding: CryptoJS.pad.Pkcs7,
  //   }).toString();
  // }
  const encryptAES = (text) => {
    var data = text;
    var key = AES_SECRET_KEY;
    var iv = GCM_SECRET_KEY;
    var encrypted = CryptoJS.AES.encrypt(
      data,
      key,
      {
        iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7
      });
    //console.log('encrypted: ' + encrypted);
    
    //var decrypted = CryptoJS.AES.decrypt(encrypted, key, { iv: iv, padding: CryptoJS.pad.Pkcs7 });
    //console.log('decrypted: ' + decrypted.toString(CryptoJS.enc.Utf8));
    return encrypted.toString()
  }
  const isFocused = useIsFocused();

  useEffect(() => {
    // Put Your Code Here Which You Want To Refresh or Reload on Coming Back to This Screen.
    setOtpValue("")
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

        <AuthNoGradientHeader title={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.CURRENT_PIN)}
          navigation={navigation}
        />


        <Text style={{
          fontSize: fontSize.textNormal,
          fontFamily: fontName.regular,
          textAlign: 'center',
          color: theme.colors.white,
          marginTop: 30,
        }}>{t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.ENTER_CURRENT_PIN)}</Text>

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
                navigation.navigate(SETTINGS.CHANGE_MPIN_2, {
                  requestData: {
                    oldPassword: otpValue
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
          style={{ position: 'absolute', bottom: 0, width: '80%', marginBottom: '10%' }}
          color='white'
          clearOnLongPress={true}
          pressMode='char'
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
              if (encryptAES(curText) === mpinData) {
                navigation.navigate(SETTINGS.CHANGE_MPIN_2, {
                  requestData: {
                    oldPassword: curText
                  }
                })
              } else {
                console.log(encryptAES(curText))
                setOtpValue("")
                showMessage({
                  message: "Error message",
                  description: "mPIN entered is wrong",
                  type: "danger",
                  hideStatusBar: true,
                  backgroundColor: "black", // background color
                  color: "white", // text color,
                  hideOnPress: true,
                  autoHide: true,
                  onPress: () => {
                    setOtpValue("")
                  },
                });
              }

            }

          }

          } />


        <View />
      </ImageBackground>

    </LinearGradient>
  );
}



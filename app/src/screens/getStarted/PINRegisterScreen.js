import React, { useEffect, useContext, useState, useCallback } from "react";
import {
  View,
  Text,
  Keyboard,
  TouchableOpacity,
  ImageBackground,

} from "react-native";
import { fontName, FONTS, fontSize } from "../../../styles/global.config";
import { AppContext } from "../../../themes/AppContextProvider";
import MainButton from "../../components/button/MainButton";
import AuthBody from "../../components/base/AuthBody";
import { Formik } from "formik";
import Box from "../../components/base/Box";
import { useTranslation } from 'react-i18next';
import StyleTextView from "../../components/input/StyleTextView";
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import { REGISTER } from "../../routes";
import { AUTH_KEYS } from '../../../assets/translations/constants';
import LinearGradient from 'react-native-linear-gradient';
import { BackIcon } from "../../../assets/svg";
import VirtualKeyboard from 'react-native-virtual-keyboard';
import { imageBackground } from "../../../assets/images";




export default function PINRegisterScreen({ navigation, route }) {
  const { theme, changeTheme } = useContext(AppContext)
  const { t, i18n } = useTranslation();
  const [disableButton, setDisableButton] = useState(true);
  const [otpValue, setOtpValue] = useState('');


  const requestData = route.params.requestData
  const resposeData = route.params.resposeData

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





  return (
    <LinearGradient
      useAngle={true}
      style={{ flex: 1, paddingTop: 20 }}
      angle={135}
      angleCenter={{ x: 0.5, y: 0.5 }}
      colors={["#4370e7", "#4370e7", "#4370e7", "#4ad4e8"]}>

      <ImageBackground
        source={imageBackground}
        style={{ width: "100%", height: "100%" }}
      >

        <View style={{ flexDirection: 'row' }}>
          <View style={{
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            zIndex: 1,
            flexDirection: 'row'
          }}>
            <TouchableOpacity
              onPress={() => { navigation.goBack() }}>
              <BackIcon />
            </TouchableOpacity>

            <Text style={FONTS.headerText}>{t(AUTH_KEYS.MPIN_LOGIN.ENTER_MPIN)}</Text>
          </View>
          <View style={{
            flex: 1,
            flexDirection: 'row',
            //textAlign: 'center',
            // alignContent: 'center',
            // alignItems: 'center',
            // justifyContent: 'center',
            // alignSelf: 'center',
          }}>
          </View>
        </View>

        <View style={{
          marginTop: '30%',
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
            onTextChange={otpVal => {
              setOtpValue(otpVal)
              if (otpVal.length === 6) {
                navigation.navigate(REGISTER.CONFIRM_PIN_REGISTER, { requestData: requestData, resposeData: resposeData, otpValue: otpVal })
              } else {
              }
            }
            }
          />
        </View>


        <VirtualKeyboard
          cellStyle={{ marginBottom: 10 }}
          style={{ position: 'absolute', bottom: 0, width: '80%', marginBottom: '15%' }}
          color='white' pressMode='string' onPress={(val) => {
            setOtpValue(val)
            if (val.length === 6) {
              navigation.navigate(REGISTER.CONFIRM_PIN_REGISTER, { requestData: requestData, resposeData: resposeData, otpValue: val })
            }
          }
          } />


        <View />
      </ImageBackground>
    </LinearGradient>
  );
}



import React, { useEffect, useContext, useState, useCallback } from "react";
import {
  View,
  Text,
  Keyboard,
  TouchableOpacity,
  Dimensions,
  ImageBackground

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
import Auth from "../../api/auth";
import { showMessage, hideMessage } from "react-native-flash-message";
import { useSelector, useDispatch } from 'react-redux';
import { setAppMobileNumber } from "../../store/actions/app.action";
import LoaderComponent from "../../components/base/LoaderComponent";
import { imageBackground } from "../../../assets/images";



export default function ConfirmPINRegisterScreen({ navigation, route }) {
  const { theme, changeTheme } = useContext(AppContext)
  const { height } = Dimensions.get('window');
  const { t, i18n } = useTranslation();
  const [disableButton, setDisableButton] = useState(true);
  const [otpValue, setOtpValue] = useState('');
  const dispatch = useDispatch();
  const [confirmOtpValue, setConfirmOtpValue] = useState('');
  const [isLoading, setLoading] = useState(false);

  const requestData = route.params.requestData
  const resposeData = route.params.resposeData
  const perviousOtp = route.params.otpValue


  const nextStep = useCallback(async (data) => {

    try {
      let request = {
        "mpin": data,
        "simNo": "",
        // "otp": requestData.otp,
        "userName": requestData.userName,
        "mobileNo": requestData.mobileNo,
        requestId: requestData.forgotmPIN ? "FORGOTMPINUSER" : "REGISTUSERCONFIRM",
        module: "REGISTRATION",
      };

      setLoading(true);
      const response = await Auth.createmPINApi(request);
      setLoading(false);
      dispatch(setAppMobileNumber(requestData.mobileNo))
      navigation.navigate(REGISTER.PIN_SUCCESS, { responseData: response })
    } catch (error) {
      setLoading(false);
      showMessage({
        message: "Error message",
        description: error.message || error.error,
        type: "danger",
        hideStatusBar: true,
        backgroundColor: "black", // background color
        color: "white", // text color
      });
    }


  },
    [navigation, otpValue]
  );



  return (

    // <AuthBody
    //   title={"Register"}
    //   hideHeader={true}
    //   isLoading={isLoading}
    //   navigation={navigation}>

    <LinearGradient
      useAngle={true}
      style={{ flex: 1 }}
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
            flexDirection: 'row',
            paddingTop: 20
          }}>
            <TouchableOpacity
              onPress={() => { navigation.goBack() }}>
              <BackIcon />
            </TouchableOpacity>
            <Text style={FONTS.headerText}>{t(AUTH_KEYS.MPIN_LOGIN.ENTER_CONFIRM_PIN)}</Text>
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
            onTextChange={otpValue => {
              // setOtpValue(otpValue)
              if (otpValue.length === 6) {
                setDisableButton(false)
                Keyboard.dismiss()
              } else {
                setDisableButton(true)
              }
            }
            }
          />
        </View>


        <VirtualKeyboard
          cellStyle={{ marginBottom: 10 }}
          style={{ position: 'absolute', bottom: 0, width: '80%', marginBottom: '15%' }}
          color='white'
          pressMode='char'
          onPress={(val) => {

            let curText = otpValue;
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
              if (perviousOtp === curText + "") {
                nextStep(curText)
              } else {
                setOtpValue("")
                showMessage({
                  message: "Error message",
                  description: "mPIN not matching",
                  type: "danger",
                  hideStatusBar: true,
                  backgroundColor: "black", // background color
                  color: "white", // text color
                });
              }

            }
          }
          }
        />


        <View />

        {isLoading && <LoaderComponent />}
      </ImageBackground>
    </LinearGradient>
    // </AuthBody>
  );
}




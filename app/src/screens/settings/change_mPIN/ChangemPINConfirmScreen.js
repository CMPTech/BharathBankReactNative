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
import { GET_STARTED, REGISTER, SETTINGS } from "../../../routes";
import { AUTH_KEYS } from '../../../../assets/translations/constants';
import LinearGradient from 'react-native-linear-gradient';
import { BackIcon } from "../../../../assets/svg";
import VirtualKeyboard from 'react-native-virtual-keyboard';
import { AuthHeader, LoaderComponent } from "../../../components";
import PlainButton from "../../../components/button/PlainButton";
import { Overlay } from 'react-native-elements'
import { showMessage, hideMessage } from "react-native-flash-message";
import Auth from "../../../api/auth";
import Home from "../../../api/dashboard";
import AuthNoGradientHeader from "../../../components/base/AuthNoGradientHeader";
import { imageBackground } from "../../../../assets/images";



export default function ChangemPINConfirmScreen({ navigation, route }) {
  const { theme, changeTheme } = useContext(AppContext)
  const { t, i18n } = useTranslation();
  const [disableButton, setDisableButton] = useState(true);
  const [otpValue, setOtpValue] = useState('');

  const [isLoading, setLoading] = useState(false);

  const requestData = route.params.requestData

  const [responseData, setResponseData] = useState([])

  const [showSuccessAlert, setShowSuccessAlert] = useState(false)

  const [confirmOtpValue, setConfirmOtpValue] = useState('');
  const nextStep = useCallback(

    async (data) => {
      try {

        navigation.navigate(REGISTER.PIN_SUCCESS)

        // "oldPassword": "guOxviE2csGZrofbVNToQg==",
        // "newPassword": "it3lrEKW9LadNgYk7avlDA==",


      } catch (error) {

      }
    },
    [navigation]
  );

  const changeMpin = useCallback(async () => {

    try {
      setLoading(true);
      const response = await Home.changeMpinApi(requestData);
      setLoading(false);
      setResponseData(response)
      setShowSuccessAlert(true)
    } catch (error) {
      setLoading(false);
      setOtpValue("")
      navigation.goBack()
      showMessage({
        message: "Error message",
        description: error.message || error.error,
        type: "danger",
        hideStatusBar: true,
        autoHide: true,
        backgroundColor: "black", // background color
        color: "white", // text color
      });
    }
  },
    [navigation]
  );


  const successAlertUI = (values) => {

    return (
      <Overlay
        isVisible={showSuccessAlert}
        //onBackdropPress={() => setShowSuccessAlert(!showSuccessAlert)}
        height='auto'
        overlayStyle={{
          color: theme.colors.mainBackground1,
          width: '90%'
        }}>


        <View style={{ padding: 15, marginTop: 10 }}>
          <StyleTextView value={"Change mPIN"} style={{
            fontSize: fontSize.textLarge,
            fontFamily: fontName.medium,
            color: theme.colors.headingTextColor,

          }} />

          <StyleTextView value={responseData?.message} style={{
            fontSize: fontSize.textColor,
            fontFamily: fontName.regular,
            marginTop: 10,
            // opacity: .6,
            lineHeight: 20,
            marginBottom: 40,
            marginTop: 20
          }} />



          <View style={{ position: 'absolute', bottom: 10, right: 10 }}>
            <PlainButton title={"Okay !"} onPress={() => {
              setShowSuccessAlert(!showSuccessAlert)
              //navigation.pop(3)
              navigation.reset({
                index: 0,
                routes: [{ name: GET_STARTED }],
              });
            }

            } />
          </View>


        </View>
      </Overlay>
    );
  }

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

        <AuthNoGradientHeader title={'Confirm new mPIN'}
          navigation={navigation}
        />


        <Text style={{
          fontSize: fontSize.textNormal,
          fontFamily: fontName.light,
          textAlign: 'center',
          color: theme.colors.white,
          marginTop: 30,
        }}>{t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.RE_ENTER_NEW_PIN)}</Text>

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
                //navigation.navigate(REGISTER.CONFIRM_PIN_REGISTER)
              } else {
              }
            }
            }
          />
        </View>


        {successAlertUI()}
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
              //navigation.navigate(REGISTER.CONFIRM_PIN_REGISTER)
              //setShowSuccessAlert(true)
              if (requestData.newPassword === curText) {
                changeMpin()
              } else {
                setOtpValue("")
                showMessage({
                  message: "Error message",
                  description: "mPIN not matching",
                  type: "danger",
                  hideStatusBar: true,
                  backgroundColor: "black", // background color
                  color: "white", // text color
                  autoHide: true,
                });
              }

            }
          }
          } />


        <View />
        {isLoading && <LoaderComponent />}
      </ImageBackground>
    </LinearGradient>
  );
}



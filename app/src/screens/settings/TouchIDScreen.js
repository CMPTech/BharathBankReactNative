import React, { useEffect, useContext, useState, useCallback } from "react";
import {
  View,
  Image,
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
import { Switch } from 'react-native-switch';
import PlainButton from "../../components/button/PlainButton";
import { Overlay } from 'react-native-elements'
import { useSelector } from "react-redux";
import { biometricStatusSelector } from "../../store/selectors";
import { store } from "../../store";
import { SET_BIOMETRIC_ENABLED } from "../../store/constants";
import Home from "../../api/dashboard";
import { showMessage, hideMessage } from "react-native-flash-message";


export default function TouchIDScreen({ navigation, route }) {

  const { theme, changeTheme } = useContext(AppContext)

  const [showSuccessAlert, setShowSuccessAlert] = useState(false)

  const [isLoading, setLoading] = useState(false);

  const [responseData, setResponseData] = useState("")

  const checkBiometricStaus = useSelector(biometricStatusSelector)

  const [enableCard, setEnableCard] = useState(checkBiometricStaus || false);

  const successAlertUI = (values) => {

    return (
      <Overlay
        isVisible={showSuccessAlert}
        onBackdropPress={() => setShowSuccessAlert(!showSuccessAlert)}
        height='auto'
        overlayStyle={{
          color: theme.colors.mainBackground1,
          width: '90%'
        }}>


        <View style={{ padding: 15, marginTop: 20 }}>
          <StyleTextView value={"Touch ID access"} style={{
            fontSize: fontSize.textLarge,
            fontFamily: fontName.medium,
            color: theme.colors.headingTextColor,
            opacity: 0.8

          }} />

          <StyleTextView value={enableCard ? "Touch ID access turned on successfully.Accessing the Nexa will become a breeze now." : "We recommend keeping Touch ID ON for better safety"} style={{
            fontSize: fontSize.textNormal,
            fontFamily: fontName.regular,
            marginTop: 10,
            color: theme.colors.grey,
            lineHeight: 20,
            marginBottom: 40,
            marginTop: 20
          }} />



          <View style={{ position: 'absolute', bottom: 10, right: 10 }}>
            <PlainButton title={"Okay !"} onPress={() => {
              setShowSuccessAlert(!showSuccessAlert)
              navigation.pop(1)
            }

            } />
          </View>


        </View>
      </Overlay>
    );
  }
  const enableTouchID = useCallback(async (val) => {

    try {
      let request = {
        touchId: val
      }
      setLoading(true);
      const response = await Home.enableTouchIDApi(request);
      setLoading(false);
      //setResponseData(response)
      store.dispatch({ type: SET_BIOMETRIC_ENABLED, payload: val });
      //if(val){
      setShowSuccessAlert(!showSuccessAlert)
      // }
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
    [navigation]
  );


  return (

    <View style={{
      flex: 1,
      backgroundColor: theme.colors.white,
    }}>

      <AuthHeader title={'Touch ID access'}
        navigation={navigation}
      />

      {successAlertUI()}

      <View style={{
        alignItems: 'center',
        margin: 30
      }}>


        <Image source={require('./../../../assets/images/touchid_icon.png')}
          resizeMode="contain"
          style={{
            width: 150,
            height: 80,
            marginTop: '10%'
          }} />

        <StyleTextView value={"One touch login"} style={{
          fontSize: fontSize.header3,
          fontFamily: fontName.medium,
          color: theme.colors.headingTextColor,
          marginTop: 20,
          opacity: 0.8
        }} />
        <StyleTextView value={"Touch ID allows you to use your fingerprint for your Nexa login."} style={{
          fontSize: fontSize.textNormal,
          fontFamily: fontName.regular,
          color: theme.colors.headingTextColor,
          marginTop: 20,
          opacity: .8,
          textAlign: 'center',
          lineHeight: 20,
          opacity: 0.8
        }} />
      </View>
      <View style={{
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: theme.colors.dividerColor,
        opacity: .2
      }} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', alignItems: 'center', marginRight: 20 }}>
        <StyleTextView value={"Touch ID access"} style={{
          fontSize: fontSize.header3,
          fontFamily: fontName.medium,
          color: theme.colors.headingTextColor,
          margin: 20,
          opacity: 0.8
        }} />

        <Switch
          value={enableCard}
          activeText={""}
          renderInActiveText={false}
          inactiveTextStyle={""}
          barHeight={20}
          circleSize={20}
          backgroundActive={theme.colors.buttonColor}
          onValueChange={(val) => {
            setEnableCard(val)
            enableTouchID(val)
          }
          }
        />
      </View>
      <View style={{
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: theme.colors.dividerColor,
        opacity: .2
      }} />

    </View >

  );
}



import React, { useEffect, useContext, useState, useCallback, } from "react";
import {
  View,
  Text,
  Keyboard,
  TouchableOpacity,
  Dimensions,

} from "react-native";
import { fontName, FONTS, fontSize, SIZES } from "../../../styles/global.config";
import { AppContext } from "../../../themes/AppContextProvider";
import MainButton from "../../components/button/MainButton";
import AuthBody from "../../components/base/AuthBody";
import { Formik } from "formik";
import Box from "../../components/base/Box";
import { useTranslation } from 'react-i18next';
import StyleTextView from "../../components/input/StyleTextView";
import { HOME, PAY_PEOPLE } from "../../routes";
import LinearGradient from 'react-native-linear-gradient';
import { BackIcon } from "../../../assets/svg";
import StyleInputView from "../../components/input/StyleInputView";
import * as Yup from 'yup'
import Auth from "../../api/auth";
import { showMessage, hideMessage } from "react-native-flash-message";
import LoaderComponent from "../../components/base/LoaderComponent";
import { useRef } from "react";
import { useSelector } from 'react-redux';
import { profileSelector } from '../../store/selectors';
import { AUTH_KEYS } from '../../../assets/translations/constants';
import Home from '../../api/dashboard';
export default function CancelScheduledPaymentOTPScreen({ navigation, route }) {
  const { params } = route;
  const { theme, changeTheme } = useContext(AppContext)
  const { t, i18n } = useTranslation();
  const [confirmOtpValue, setConfirmOtpValue] = useState('');
  const [isLoading, setLoading] = useState(false);
  const { height } = Dimensions.get('window');
  const selectedProfileDetails = useSelector(profileSelector);
  const formRef = useRef()
  const inputRefs = []
  let timer = () => { };

  const [timeLeft, setTimeLeft] = useState(120);

  const startTimer = () => {
    timer = setTimeout(() => {
      if (timeLeft <= 0) {
        clearTimeout(timer);
        return false;
      }
      setTimeLeft(timeLeft - 1);
    }, 1000)
  }

  useEffect(() => {
    startTimer();
    return () => clearTimeout(timer);
  });

  const start = () => {
    setTimeLeft(120);
    clearTimeout(timer);
    startTimer();
  }

  const nextStep = useCallback(async (data) => {
    try {

      Keyboard.dismiss()
      setLoading(true);
      let request = {
        ...params.requestData
      }
      request.otp = data.otpVal
      const response = await Home.cancelScheduledTransferConfirm(request);
      showMessage({
        message: "",
        description: response.message,
        type: "danger",
        hideStatusBar: true,
        backgroundColor: "black", // background color
        color: "white", // text color
      });
      navigation.navigate(PAY_PEOPLE.SCHEDULED_TRANSFERS)
      setLoading(false);
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
    [navigation, confirmOtpValue]
  );
  const resendOtp = useCallback(async () => {
    try {

      Keyboard.dismiss()
      setLoading(true);
      let request = {
        ...params.requestData
      }
      setLoading(true);
      const response = await Home.cancelScheduledTransfer(request);
      setLoading(false);
      start()
      showMessage({
        message: "Resend OTP",
        description: "Your OTP has been resent to your registered mobile number",
        type: "success",
        hideStatusBar: true,
        backgroundColor: "black", // background color
        color: "white", // text color
      });

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
    [navigation, confirmOtpValue]
  );
  const PANcardSchema = Yup.object().shape({
    otpVal: Yup.string()
      .min(6, "OTP should be 6 digits")
      .required("*"),

  })
  return (
    <LinearGradient
      useAngle={true}
      style={{ flex: 1, paddingTop: 20 }}
      angle={180}
      angleCenter={{ x: 0.5, y: 0.5 }}
      colors={["#4370e7", "#479ae8", "#4ad4e8"]} >

      <View style={{ flexDirection: 'row' }}>
        <View style={{
          alignContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          zIndex: 1,
          marginLeft: 10,
          overflow: 'visible'
        }}>
          <TouchableOpacity
            onPress={() => { navigation.goBack() }}>
            <BackIcon />
          </TouchableOpacity>
        </View>
        <Text style={{
          color: theme.colors.white,
          fontSize: fontSize.header2,
          textAlign: 'center',
          alignSelf: 'center',
          marginLeft: SIZES.width * 0.25,
          fontFamily: fontName.regular,


        }}>{"Enter OTP"}</Text>



      </View>
      {/* // (selectedProfileDetails.mobileNo.substring(10, 6)) */}
      <View style={{ padding: 10, flex: 1, marginTop: '20%' }}>

        <Formik
          initialValues={{
            otpVal: "",
            grid1: "",
            grid2: "",
            grid3: "",
          }}
          innerRef={formRef}
          validationSchema={() => PANcardSchema}
          onSubmit={nextStep}
        >
          {({
            handleChange,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldValue,
          }) => (
            <View style={{ alignSelf: 'stretch', margin: 10 }}>
              <StyleTextView value={`${"To proceed, please enter the one time password (OTP) sent to your registered mobile number XXXXXX"} ${selectedProfileDetails.mobileNo.substring(10, 6)}`} style={{
                fontSize: fontSize.textLarge,
                fontFamily: fontName.regular,
                color: theme.colors.white,
                textAlign: 'center'
              }} />

              <View style={{
                margin: 30,
                alignItems: 'center'
              }}>
                <StyleInputView
                  text={""}
                  value={values.otpVal}
                  maxLength={6}
                  touched={touched.otpVal}
                  returnKeyType='done'
                  autoComplete="sms-otp" // android
                  textContentType="oneTimeCode" // ios
                  keyboardType='phone-pad'
                  errors={errors.otpVal}
                  onPress={() => { }}
                  setRef={(ref) => {
                    inputRefs[3] = ref
                  }}
                  hintStyle={{ color: theme.colors.white, textAlign: 'center' }}
                  inputViewStyle={{
                    alignSelf: 'center',
                    borderColor: theme.colors.lightGreen,
                    borderBottomColor: theme.colors.lightGreen,
                    padding: 10,
                    color: theme.colors.white,
                    width: SIZES.width - 100,
                    textAlign: 'center'
                  }}
                  onChangeText={(text) => {
                    setFieldValue('otpVal', (text))

                  }}
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
              </View>

              {timeLeft === 0 ?

                <TouchableOpacity
                  onPress={() =>
                    resendOtp()
                  }>
                  <StyleTextView value={t(AUTH_KEYS.REGISTER.RESEND_OTP)} style={{
                    fontSize: fontSize.textSmall,
                    fontFamily: fontName.semi_bold,
                    color: theme.colors.lightGreen,
                    textAlign: 'center',
                    marginTop: 20
                  }} />
                </TouchableOpacity>
                :
                <StyleTextView value={"Resend OTP in " + timeLeft + " sec"} style={{
                  fontSize: fontSize.textSmall,
                  fontFamily: fontName.regular,
                  color: theme.colors.white,
                  textAlign: 'center',
                  marginTop: 20,
                  opacity: 0.8
                }} />

              }

            </View>
          )}
        </Formik>

      </View>
      <View />

      <MainButton btnContainerStyle={{ width: '100%' }} title={"Proceed"} onPress={() => {
        if (formRef.current) {
          formRef.current.handleSubmit()
        }
      }
      } />
      {isLoading && <LoaderComponent />}
    </LinearGradient>
  );
}

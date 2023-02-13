import React, { useEffect, useContext, useState, useCallback, } from "react";
import {
  View,
  Text,
  Keyboard,
  TouchableOpacity,
  Dimensions,
  ImageBackground
} from "react-native";
import { fontName, FONTS, fontSize, SIZES } from "../../../styles/global.config";
import { AppContext } from "../../../themes/AppContextProvider";
import MainButton from "../../components/button/MainButton";
import AuthBody from "../../components/base/AuthBody";
import { Formik } from "formik";
import Box from "../../components/base/Box";
import { useTranslation } from 'react-i18next';
import StyleTextView from "../../components/input/StyleTextView";
import { PAY_PEOPLE } from "../../routes";
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
import { getNumbersOnly } from "../../utils/amount-util";
import AuthNoGradientHeader from "../../components/base/AuthNoGradientHeader";
import { imageBackground } from "../../../assets/images";
export default function DeletePayeeOTPScreen({ navigation, route }) {
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
        ...params.requestData,
        "otp": data.otpVal,
      }
      const response = await Home.getDeleteConfirmApi(request);
      navigation.goBack();
      setLoading(false);
      showMessage({
        message: "Delete Payee",
        description: response.message,
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
  const resendOtp = useCallback(async () => {
    try {

      Keyboard.dismiss()
      setLoading(true);
      let request = {
        ...params.requestData
      }
      const response = await Home.getDeleteVerifyApi(request);
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
      .required("OTP is required *"),

  })
  return (
    <LinearGradient
      useAngle={true}
      style={{ flex: 1, }}
      angle={180}
      angleCenter={{ x: 0.5, y: 0.5 }}
      colors={["#4370e7", "#479ae8", "#4ad4e8"]} >

      <ImageBackground
        source={imageBackground}
        style={{ width: "100%", height: "100%" }}
      >
        <AuthNoGradientHeader
          title={t(AUTH_KEYS.REGISTER.ENTER_OTP)}
          navigation={navigation}
        />
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
                  textAlign: 'center',
                  lineHeight: 20
                }} />

                <View style={{
                  margin: 30,
                  alignItems: 'center'
                }}>
                  <StyleInputView
                    text={" "}
                    value={values.otpVal}
                    maxLength={6}
                    placeholder={t(AUTH_KEYS.FUND_TRANSFER.OTP)}
                    placeholderColor={theme.colors.white}
                    errorColor={theme.colors.lightGreen}
                    touched={touched.otpVal}
                    returnKeyType='done'
                    keyboardType='phone-pad'
                    errors={errors.otpVal}
                    autoComplete="sms-otp" // android
                    textContentType="oneTimeCode" // ios
                    onPress={() => { }}
                    setRef={(ref) => {
                      inputRefs[3] = ref
                    }}
                    hintStyle={{ color: theme.colors.white, textAlign: 'center' }}
                    inputViewStyle={{
                      alignSelf: 'center',
                      borderColor: theme.colors.lightGreen,
                      borderBottomColor: theme.colors.lightGreen,
                      paddingLeft: 10,
                      paddingRight: 10,
                      color: theme.colors.white,
                      width: SIZES.width - 100,
                      textAlign: 'center'
                    }}
                    onChangeText={(text) => {
                      setFieldValue('otpVal', getNumbersOnly(text))

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
        </ImageBackground>
    </LinearGradient>
  );
}

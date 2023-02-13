import React, { useEffect, useContext, useState, useCallback, } from "react";
import {
  View,
  Platform,
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
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import { REGISTER } from "../../routes";
import { AUTH_KEYS } from '../../../assets/translations/constants';
import LinearGradient from 'react-native-linear-gradient';
import { BackIcon } from "../../../assets/svg";
import StyleInputView from "../../components/input/StyleInputView";
import * as Yup from 'yup'
import Auth from "../../api/auth";
import { showMessage, hideMessage } from "react-native-flash-message";
import LoaderComponent from "../../components/base/LoaderComponent";
import { useRef } from "react";
import AuthHeader from "../../components/base/AuthHeader";
import AuthNoGradientHeader from "../../components/base/AuthNoGradientHeader";
import { imageBackground } from "../../../assets/images";
import { getNumbersOnly } from "../../utils/amount-util";
import { Overlay } from 'react-native-elements'
import PlainButton from "../../components/button/PlainButton";

export default function CardCodeOTPScreen({ navigation, route }) {
  const { theme, changeTheme } = useContext(AppContext)
  const { t, i18n } = useTranslation();
  const [confirmOtpValue, setConfirmOtpValue] = useState('');
  const [isLoading, setLoading] = useState(false);
  const { assistanceMsg } = route.params;
  const { height } = Dimensions.get('window');

  const [hasOTPIssue, setHasOTPIssue] = useState(false)

  const [havingOtpProblem, setHaveOtpProblem] = useState(false)
  const formRef = useRef()

  const requestData = route.params.requestData
  const resposeData = route.params.resposeData
  const inputRefs = []
  const focus = useCallback(
    (index) => {
      inputRefs[index].focus()
    },
    [inputRefs]
  )



  const resendOptp = useCallback(async (data) => {
    try {

      setLoading(true);
      const response = await Auth.registrationVerifyApi(requestData);
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
      setHasOTPIssue(true)
    } catch (error) {
      setLoading(false);
      setHasOTPIssue(true)
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

  const nextStep = useCallback(async (data) => {
    try {
      let request = {

        "cardCode": resposeData.cardCode,
        "cardCodeValue": resposeData.otpEnable ? "" : data.grid1 + data.grid2 + data.grid3,
        "otp": data.otpVal,
        "userName": requestData.userName,
        "requestId": requestData.forgotmPIN ? "FORGOTMPINCONFIRM" : "REGISTUSERCONFIRM",
        "mobileNo": requestData.mobileNo,
        forgotmPIN: requestData.forgotmPIN,
        module: "REGISTRATION",
        //registrationType: "PAN CARD"
        registrationType: requestData.registrationType
      };
      setLoading(true);
      const response = await Auth.registrationConfirmApi(request);
      setLoading(false);
      navigation.navigate(REGISTER.PIN_REGISTER, { requestData: request, resposeData: response })
    } catch (error) {
      setLoading(false);
      data.otpVal = ""
      setConfirmOtpValue('')
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

  const gridSchema = Yup.object().shape({
    grid1: Yup.string()
      .min(2, "")
      .required("*"),
    grid2: Yup.string()
      .min(2, "")
      .required("*"),
    grid3: Yup.string()
      .min(2, "")
      .required("*"),

  })

  let timer = () => { };

  const [timeLeft, setTimeLeft] = useState(120);




  // const startTimer = (firstTime) => {

  //   timer = setTimeout(() => {
  //     if (timeLeft <= 0) {
  //       clearTimeout(timer);
  //       if (firstTime === false) {
  //         setHaveOtpProblem(true)
  //       }
  //       return false;
  //     }
  //     setTimeLeft(timeLeft - 1);
  //   }, 1000)
  // }

  const startTimer = () => {
    timer = setTimeout(() => {
      if (timeLeft <= 0) {
        clearTimeout(timer);
        return false;
      }
      setTimeLeft(timeLeft - 1);
    }, 1000)
  }

  // useEffect(() => {
  //   //setHaveOtpProblem(true)
  //   let firstTime = true
  //   startTimer(firstTime);
  //   return () => clearTimeout(timer);
  // }, []);
  // const start = () => {
  //   setTimeLeft(120);
  //   clearTimeout(timer);
  //   let firstTime = false
  //   startTimer(firstTime);
  // }


  useEffect(() => {
    startTimer();
    return () => clearTimeout(timer);
  });
  const start = () => {
    setTimeLeft(120);
    clearTimeout(timer);
    startTimer();
  }



  const overlayInfoComponent = (values) => {

    return (
      <Overlay
        isVisible={havingOtpProblem}
        onBackdropPress={() => setHaveOtpProblem(!havingOtpProblem)}
        height='auto'
        overlayStyle={{
          color: theme.colors.mainBackground1,
          margin: 10,
          borderRadius: 10,
          width: '80%'
        }}>


        <View style={{ justifyContent: 'center', alignItems: 'center', padding: 15 }}>
          <StyleTextView value={assistanceMsg} style={{
            fontSize: fontSize.textNormal,
            fontFamily: fontName.regular,
            color: theme.colors.grey,
            textAlign: 'center',
            marginTop: 10,
            marginBottom: 20,
            lineHeight: Platform.OS === 'android' ? 22 : 18
          }} />
          <PlainButton title={"Okay"} onPress={() => {
            setHaveOtpProblem(false)
            navigation.goBack()
          }
          } />
        </View>
      </Overlay>
    );
  }
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
        {overlayInfoComponent()}
        <AuthNoGradientHeader
          title={resposeData.otpEnable ? t(AUTH_KEYS.REGISTER.ENTER_OTP) : "Enter card code"}
          navigation={navigation}
        />

        <View style={{ padding: 10, flex: 1, marginTop: 10 }}>

          <Formik
            initialValues={{
              otpVal: "",
              grid1: "",
              grid2: "",
              grid3: "",
            }}
            innerRef={formRef}
            validationSchema={() => resposeData.otpEnable ? PANcardSchema : gridSchema}
            validateOnChange
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

                {!resposeData.otpEnable &&
                  <StyleTextView value={t(AUTH_KEYS.REGISTER.USE_CARD_CODE)} style={{
                    fontSize: fontSize.textLarge,
                    fontFamily: fontName.semi_bold,
                    color: theme.colors.white,
                  }} />
                }
                {!resposeData.otpEnable &&
                  <StyleTextView value={t(AUTH_KEYS.REGISTER.REGISTER_CARD_PROVIDE)} style={{
                    fontSize: fontSize.textSmall,
                    fontFamily: fontName.regular,
                    color: theme.colors.white,
                    marginTop: 5
                  }} />
                }


                {!resposeData.otpEnable &&
                  <View style={{
                    flexDirection: 'row',
                    //justifyContent: 'space-evenly',
                    //alignContent: 'center',
                    //alignItems: 'center'
                  }}>

                    <StyleInputView
                      text={Array.from(resposeData.cardCode)[0]}
                      value={values.grid1}
                      touched={touched.grid1}
                      returnKeyType='done'
                      maxLength={2}
                      keyboardType='phone-pad'
                      errors={errors.grid1}
                      onPress={() => { }}
                      setRef={(ref) => {
                        inputRefs[1] = ref
                      }}
                      onChangeText={(text) => {
                        setFieldValue('grid1', (text))

                        if (text.length === 2) {
                          focus(2)
                        }
                      }}
                      containerStyle={{ marginRight: '20%' }}
                      hintStyle={{
                        color: theme.colors.white, textAlign: 'center', alignContent: 'center',
                        alignItems: 'center'
                      }}
                      inputViewStyle={{
                        alignSelf: 'center',
                        borderColor: theme.colors.lightGreen,
                        borderWidth: 2,
                        borderBottomColor: theme.colors.lightGreen,
                        minWidth: 60,
                        padding: 10,
                        color: theme.colors.white
                      }}
                      textInputConatinerStyle={{ width: '40%', alignItems: 'center', textAlign: 'center' }}
                      onSubmitEditing={() => focus(2)}
                    />
                    <StyleInputView
                      text={Array.from(resposeData.cardCode)[1]}
                      value={values.grid2}
                      maxLength={2}
                      touched={touched.grid2}
                      returnKeyType='done'
                      keyboardType='phone-pad'
                      errors={errors.grid2}
                      onPress={() => { }}
                      setRef={(ref) => {
                        inputRefs[2] = ref
                      }}
                      containerStyle={{ marginRight: '20%' }}
                      hintStyle={{
                        color: theme.colors.white,
                        textAlign: 'center',
                        alignContent: 'center',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      inputViewStyle={{
                        alignSelf: 'center',
                        borderColor: theme.colors.lightGreen,
                        borderWidth: 2,
                        borderBottomColor: theme.colors.lightGreen,
                        minWidth: 60,
                        padding: 10,
                        color: theme.colors.white,
                      }}
                      onChangeText={(text) => {
                        setFieldValue('grid2', (text))
                        if (text.length === 2) {
                          focus(3)
                        }
                      }}
                      textInputConatinerStyle={{ width: '30%', alignItems: 'center', textAlign: 'center' }}
                      onSubmitEditing={() => focus(3)}
                    />
                    <StyleInputView
                      text={Array.from(resposeData.cardCode)[2]}
                      value={values.grid3}
                      maxLength={2}
                      touched={touched.grid3}
                      returnKeyType='done'
                      keyboardType='phone-pad'
                      errors={errors.grid3}
                      onPress={() => { }}
                      setRef={(ref) => {
                        inputRefs[3] = ref
                      }}
                      containerStyle={{ marginRight: '10%' }}
                      hintStyle={{ color: theme.colors.white, textAlign: 'center' }}
                      inputViewStyle={{
                        alignSelf: 'center',
                        borderColor: theme.colors.lightGreen,
                        borderWidth: 2,
                        borderBottomColor: theme.colors.lightGreen,
                        minWidth: 60,
                        padding: 10,
                        color: theme.colors.white
                      }}
                      textInputConatinerStyle={{ width: '30%', alignSelf: 'stretch', alignItems: 'center' }}
                      onChangeText={(text) => {
                        setFieldValue('grid3', (text))
                        if (text.length === 2) {
                          Keyboard.dismiss()
                        }
                      }}
                      onSubmitEditing={() => Keyboard.dismiss()}
                    />
                  </View>
                }


                {!resposeData.otpEnable &&
                  <StyleTextView value={"What is card code ?"} style={{
                    fontSize: fontSize.textSmall,
                    fontFamily: fontName.regular,
                    color: theme.colors.white,
                    marginTop: '5%'
                  }} />
                }

                {!resposeData.otpEnable &&
                  <StyleTextView value={"Know about card code"} style={{
                    fontSize: fontSize.textSmall,
                    fontFamily: fontName.regular,
                    color: theme.colors.white,
                    marginTop: '5%'
                  }} />
                }

                {resposeData.otpEnable &&
                  <StyleTextView value={t(AUTH_KEYS.REGISTER.ENTER_OTP_TO_PROCEED) + (requestData.mobileNo.substring(10, 6))} style={{
                    fontSize: fontSize.textLarge,
                    fontFamily: fontName.regular,
                    color: theme.colors.white,
                    textAlign: 'center',
                    lineHeight: 22,
                    marginTop: 30
                  }} />

                }
                {resposeData.otpEnable &&
                  <View style={{
                    alignItems: 'center'
                  }}>


                    {/* <SmoothPinCodeInput
                  password mask="﹡"
                  cellSize={40}
                  codeLength={6}
                  value={confirmOtpValue}
                  onTextChange={otpValue => {
                    setConfirmOtpValue(otpValue)
                    if (otpValue.length === 6) {
                      Keyboard.dismiss()
                    } else {
                    }
                  }
                  }
                  cellStyle={{
                    borderWidth: 2,
                    borderRadius: 10,
                    borderColor: theme.colors.lightGreen,
                    marginTop: 20,
                    marginRight: 10
                    //backgroundColor: theme.colors.otpBackground,
                  }}
                  cellStyleFocused={{
                    borderColor: theme.colors.white,
                  }}
                  textStyle={{
                    fontSize: fontSize.textNormal,
                    color: theme.colors.white,
                    fontFamily: fontName.semi_bold,
                  }}
                  textStyleFocused={{
                    color: theme.colors.headingTextColor
                  }}
                /> */}

                    <StyleInputView
                      text={""}
                      placeholder={t(AUTH_KEYS.FUND_TRANSFER.OTP)}
                      placeholderColor={theme.colors.white}
                      errorColor={theme.colors.lightGreen}
                      value={confirmOtpValue}
                      maxLength={6}
                      autoComplete="sms-otp" // android
                      textContentType="oneTimeCode" // ios
                      touched={touched.otpVal}
                      returnKeyType='done'
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
                        paddingLeft: SIZES.width / 3,
                        paddingRight: 10,
                        color: theme.colors.white,
                        width: SIZES.width - 100,
                        // textAlign: 'center'
                      }}

                      onChangeText={(text) => {
                        setConfirmOtpValue(getNumbersOnly(text))
                        setFieldValue('otpVal', getNumbersOnly(text))
                      }}
                      onSubmitEditing={() => Keyboard.dismiss()}
                    />
                  </View>
                }


                {resposeData.otpEnable &&
                  <View>
                    {timeLeft === 0 ?
                      (hasOTPIssue ?
                        setHaveOtpProblem(true)
                        :
                        <TouchableOpacity
                          onPress={() =>
                            resendOptp()

                          }>
                          <StyleTextView value={t(AUTH_KEYS.REGISTER.RESEND_OTP)} style={{
                            fontSize: fontSize.textSmall,
                            fontFamily: fontName.semi_bold,
                            color: theme.colors.lightGreen,
                            textAlign: 'center',
                            marginTop: 20
                          }} />
                        </TouchableOpacity>
                      )

                      :
                      <StyleTextView value={t(AUTH_KEYS.FUND_TRANSFER.RESEND_OTP_IN_SEC) + " " + timeLeft + " sec"} style={{
                        fontSize: fontSize.textSmall,
                        fontFamily: fontName.regular,
                        color: theme.colors.white,
                        textAlign: 'center',
                        marginTop: 20,
                        opacity: 0.8
                      }} />

                    }
                  </View>
                }



              </View>
            )}
          </Formik>

        </View>






        <View />

        <MainButton btnContainerStyle={{ width: '100%' }} title={t(AUTH_KEYS.FUND_TRANSFER.PROCEED)}
          disabled={!confirmOtpValue.length === 6}
          onPress={() => {
            if (formRef.current) {
              formRef.current.handleSubmit()
            }
          }
          } />

        {isLoading && <LoaderComponent />}
      </ImageBackground>
    </LinearGradient>
    // </AuthBody>
  );
}


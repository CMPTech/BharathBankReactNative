import { Formik } from "formik";
import React, { useEffect, useState, useCallback, useContext } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Image,
  Keyboard
} from "react-native";
import Box from "../../components/base/Box";
import HeaderTitleText from "../../components/base/HeaderTitleText";
import AuthBody from "../../components/base/AuthBody";
import useKeyboardDidShow from "../../components/base/useKeyboardDidShow";
import MainButton from "../../components/button/MainButton";
import SecondaryButton from "../../components/button/SecondaryButton";
import StyleInputView from "../../components/input/StyleInputView";
import * as Yup from 'yup'
import { AUTH, HOME } from "../../routes";
import { login, verifyOTP } from "../../services/auth";
import Auth from "../../api/auth";
import Toast from "react-native-toast-message";
import PlainButton from "../../components/button/PlainButton";
import ChangeThemeComponent from "../../components/base/ChangeThemeCompnent";
import { AppContext } from "../../../themes/AppContextProvider";
import StyleTextView from "../../components/input/StyleTextView";
import Environment from "../../environment";
import { fontSize } from "../../../styles/global.config";
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import { store } from "../../store";
import { RESET_USER } from "../../store/constants";

export default function LoginScreen({ navigation, route }) {

  const inputRefs = []
  const [isLoading, setLoading] = useState(false);
  const [imageData, setImageData] = useState(null);
  const focus = useCallback(
    (index) => {
      inputRefs[index].focus()
    },
    [inputRefs]
  )

  const [disableButton, setDisableButton] = useState(true);
  const [otpValue, setOtpValue] = useState('');

  const { theme, changeTheme } = useContext(AppContext)

  const LoginSchema = Yup.object().shape({
    username: Yup.string()
      .required("Username is required"),
    password: Yup.string()
      //.min(8, getTranslation(VALIDATION_MESSAGES.MIN_LENGTH_LOGIN_PASSWORD))
      .required("Password is required"),
  })


  const login = useCallback(

    async (data) => {
      try {
        store.dispatch({ type: RESET_USER })

        setLoading(true);
        const response = await Auth.loginUser({
          username: data.username,
          password: data.password,
        });
        setLoading(false);
        if (response.forceChangePwd) {
          navigation.navigate(AUTH.CHANGE_PASSWORD);
        } else {
          if (response.otpEnable) {
            navigation.navigate(AUTH.OTP);
          } else {
            navigation.navigate(HOME.DASHBOARD);
          }
        }
      } catch (error) {
        setLoading(false);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error.message,
        });
      }
    },
    [navigation]
  );




  return (
    <AuthBody isLoading={isLoading}
      isLoginPage={true}>

      <ChangeThemeComponent />

      <HeaderTitleText title={"Log in to your account"} />

      <Formik
        initialValues={{
          username: "",
          password: "",
        }}
        validationSchema={LoginSchema}
        onSubmit={login}>
        {({
          handleChange,
          handleSubmit,
          values,
          errors,
          touched,
          setFieldValue,
        }) => (
          <View>
            <Box>
              <StyleInputView
                text={"Username/Customer ID"}
                forgotText={"Forgot Username?"}
                value={values.username}
                touched={touched.username}
                returnKeyType='done'
                errors={errors.username}
                onPress={() => { }}
                onSubmitEditing={() => focus(1)}
                setRef={(ref) => {
                  inputRefs[0] = ref
                }}
                onChangeText={(text) => {
                  setFieldValue('username', (text))
                }}
              />
              <StyleInputView
                text={"Password"}
                secureTextEntry={true}
                forgotText={"Forgot Password?"}
                value={values.password}
                touched={touched.password}
                returnKeyType='done'
                errors={errors.password}
                onPress={() => { }}
                setRef={(ref) => {
                  inputRefs[1] = ref
                }}
                onChangeText={(text) => {
                  setFieldValue('password', (text))
                }}
                onSubmitEditing={() => handleSubmit()}
              />


              <View />
              <MainButton title={"Login"} onPress={() => handleSubmit()} />
              <View style={{ marginTop: 10 }} />
              <SecondaryButton title={"Sign Up"} onPress={() => navigation.navigate(AUTH.REGISTER_STEP_1)} />
              <View style={{ marginBottom: 10 }} />

            

            </Box>


          </View>
        )}
      </Formik>







    </AuthBody>
  );
}




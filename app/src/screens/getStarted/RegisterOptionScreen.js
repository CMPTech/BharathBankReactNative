import React, { useEffect, useContext, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  Dimensions,
  Platform,
} from "react-native";
import { fontName, FONTS, fontSize, SIZES } from "../../../styles/global.config";
import { AppContext } from "../../../themes/AppContextProvider";
import MainButton from "../../components/button/MainButton";
import StyleInputView from "../../components/input/StyleInputView";
import AuthBody from "../../components/base/AuthBody";
import { Formik } from "formik";
import Box from "../../components/base/Box";
import { AcceptTermsIcon, AcceptTermsUncheckIcon, BackIcon, CloseIcon, DebitCardIcon, MoreInfoIcon, PanCardIcon, RadioButtonCheckedIcon, RadioButtonUncheckedIcon } from "../../../assets/svg";
import StyleTextView from "../../components/input/StyleTextView";
import * as Yup from 'yup'
import { Overlay } from 'react-native-elements'
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import { AUTH, REGISTER } from "../../routes";
import { useTranslation } from 'react-i18next';
import { AUTH_KEYS } from "../../../assets/translations/constants";
import TitleText from "../../components/base/TitleText";
import Auth from "../../api/auth";
import { showMessage, hideMessage } from "react-native-flash-message";
import PlainButton from "../../components/button/PlainButton";
import PDFView from 'react-native-view-pdf';
import { AuthHeader, LoaderComponent } from "../../components";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { getAlphabetsAndNumbersOnly, getNumbersOnly, getAlphabetsAndNumbersOnlyUpperCase, getAlphabetsUpperCaseAndNumbersOnly } from "../../utils/amount-util";
export default function RegisterOptionScreen({ navigation, route }) {
  const { t, i18n } = useTranslation();
  const { assistanceMsg } = route.params;
  const { theme, changeTheme } = useContext(AppContext)

  const forgotmPIN = route.params.forgotmPIN || false

  const formRef = useRef()
  const RegisterOptionSchemaPAN = Yup.object().shape({
    custID: Yup.string()
      .required(t(AUTH_KEYS.REGISTER.CUSTOMER_ID_ERROR)).matches(
        /([CR]){1}([0-9]){1,14}$/,
        t(AUTH_KEYS.REGISTER.CUSTOMER_ID_ERROR)
      ),
    mobileNumber: Yup.string()
      .required(t(AUTH_KEYS.REGISTER.MOBILE_NUMBER_ERROR)).matches(
        /^[6-9][0-9]{9}$/,
        t(AUTH_KEYS.REGISTER.MOBILE_NUMBER_ERROR)
      ),
    panNumber: Yup.string()
      .matches(
        /([A-Z]){5}([0-9]){4}([A-Z]){1}$/,
        "Please enter a valid PAN Number"
      )
  })
  const RegisterOptionSchemaDebitCard = Yup.object().shape({
    custID: Yup.string()
      .required(t(AUTH_KEYS.REGISTER.CUSTOMER_ID_ERROR)).matches(
        /([CR]){1}([0-9]){1,14}$/,
        t(AUTH_KEYS.REGISTER.CUSTOMER_ID_ERROR)
      ),
    mobileNumber: Yup.string()
      .required(t(AUTH_KEYS.REGISTER.MOBILE_NUMBER_ERROR)).matches(
        /^[6-9][0-9]{9}$/,
        t(AUTH_KEYS.REGISTER.MOBILE_NUMBER_ERROR)
      ),
    panNumber: Yup.string()
      .matches(
        /([0-9]){5,5}$/,
        "Please enter last 5 digits of your debit card  "
      )
  })
  const [isTermsVisible, setTermsVisible] = useState(false)

  const [acceptTerms, setAcceptTerms] = useState(false)

  const [isVisitedTerms, setVisitedTerms] = useState(false)

  const [disableButton, setDisableButton] = useState(true);

  const [showDebitCardView, setShowDebitCardView] = useState(false)

  const [showPANCardView, setShowPANCardView] = useState(false)


  const [checked, setChecked] = useState(0);
  const buttons = [{ title: t(AUTH_KEYS.REGISTER.PAN_NUMBER), desc: t(AUTH_KEYS.REGISTER.PAN_DESCRIPTION), icon: <PanCardIcon /> }, { title: t(AUTH_KEYS.REGISTER.DEBIT_CARD), desc: t(AUTH_KEYS.REGISTER.DEBIT_CARD_DESCRIPTION), icon: <DebitCardIcon /> }]
  const [isLoading, setLoading] = useState(false);

  const [termsLoading, setermsLoading] = useState(true);

  const [otpValue, setOtpValue] = useState('');

  const [shwoOTPFiedl, setShwoOTPFiedl] = useState(false);

  const [resources, setResources] = useState({
    file: Platform.OS === 'ios' ? 'downloadedDocument.pdf' : '/sdcard/Download/downloadedDocument.pdf',
    url: null,
    base64: 'JVBERi0xLjMKJcfs...',
  });


  const resourceType = 'url';

  const inputRefs = []
  const focus = useCallback(
    (index) => {
      inputRefs[index].focus()
    },
    [inputRefs]
  )


  const DebitacardSchema = Yup.object().shape({
    cardNo: Yup.string()
      .required(t(AUTH_KEYS.REGISTER.CARD_NUMBER_ERROR)),
    validTill: Yup.string()
      .required(t(AUTH_KEYS.REGISTER.VALID_DATE_ERROR)),
    cvv: Yup.string()
      .required(t(AUTH_KEYS.REGISTER.CVV_ERROR)),
  })

  const PANcardSchema = Yup.object().shape({
    panNo: Yup.string()
      .required(t(AUTH_KEYS.REGISTER.PAN_NUMBER_ERROR)),
    grid1: Yup.string()
      .required("*"),
    grid2: Yup.string()
      .required("*"),
    grid3: Yup.string()
      .required("*"),
  })


  const getTermsLink = useCallback(async () => {

    try {
      let request = {
        module: "GENERAL",
      };
      setLoading(true);
      const response = await Auth.getTermsLinkApi(request);
      setLoading(false);
      setResources({
        file: Platform.OS === 'ios' ? 'downloadedDocument.pdf' : '/sdcard/Download/downloadedDocument.pdf',
        url: response.url,
        base64: 'JVBERi0xLjMKJcfs...',
      })
    } catch (error) {
      setLoading(false);
      showMessage({
        message: "Terms and conditions",
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
    if (!acceptTerms)
      return
    try {
      let request = {
        "cifId": data.custID,
        "mobileNo": data.mobileNumber,
        // "registrationType": data.isPancard ? "PAN CARD" : "DEBIT CARD",
        "registrationType": data.isPancard ? "PAN_CARD_CARD_CODE" : "DEBIT CARD",
        "panNo": data.isPancard ? data.panNumber : "",
        "debitCardNo": data.isPancard ? "" : data.panNumber,
        "userName": data.mobileNumber,
        requestId: forgotmPIN ? "FORGOTMPINVERIFY" : "REGISTUSERVRFY",
        forgotmPIN,
        module: "REGISTRATION",
        atmPIN: "",

      };
      setLoading(true);
      const response = await Auth.registrationVerifyApi(request);
      setLoading(false);
      navigation.navigate(REGISTER.CODE_OTP, { requestData: request, resposeData: response, assistanceMsg })

    } catch (error) {
      setLoading(false);
      showMessage({
        message: "Error message",
        description: error.message || error.error,
        type: "default",
        hideStatusBar: true,
        backgroundColor: "black", // background color
        color: "white", // text color,
        titleStyle: { paddingVertical: 2 }
      });
    }
  },
    [navigation, acceptTerms]
  );

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };

  const debitCardStep = useCallback(

    async (data) => {
      try {

        setShwoOTPFiedl(true)
      } catch (error) {

      }
    },
    [navigation]
  );

  const panCardStep = useCallback(
    async (data) => {
      try {
        setShowPANCardView(!showPANCardView)
        navigation.navigate(REGISTER.PIN_REGISTER)
      } catch (error) {

      }
    },
    [navigation, showPANCardView]
  );

  const overlayTermsComponent = (values) => {

    const [activePage, setActivePage] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    useEffect(() => {
      getTermsLink()
    }, []);

    return (
      <Overlay
        isVisible={isTermsVisible}
        onBackdropPress={() => setTermsVisible(!isTermsVisible)}
        width='100%'
        overlayStyle={{
          color: theme.colors.white,
          width: '100%',
          flex: 1,
          marginTop: Platform.OS === 'ios'?'10%':'0%',
        }}>



        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => {
              setTermsVisible(!isTermsVisible)
            }} >
            <BackIcon color1={theme.colors.buttonColor} />
          </TouchableOpacity>

          <StyleTextView value={t(AUTH_KEYS.REGISTER.BEFORE_YOU_CONTINUE)} style={{
            ...FONTS.headerText,
            color: theme.colors.buttonColor,
          }} />
        </View>

        <View
          style={{
            borderWidth: 1,
            borderColor: theme.colors.grey,
            position: "absolute",
            top: `${((activePage * 100) / totalPage) + 5}%`,
            height: `${totalPage - activePage}%`,
            right: 5,
            overflow: 'scroll',
            maxHeight: 200,
            flex: 1,
            flexWrap: 'wrap',
            overflow: 'hidden'
          }}
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

          {/* Some Controls to change PDF resource */}



       
          <PDFView
            fadeInDuration={250.0}
            style={{ flex: 1, width: '100%', height: '100%' }}
            resource={resources[resourceType]}
            resourceType={resourceType}
            onLoad={() => {
              setVisitedTerms(true)
              console.log(`PDF rendered from ${resourceType}`)
              setermsLoading(false)
            }
            }
            onError={(error) => console.log('Cannot render PDF', error)}
            onScrolled={(error) => error === 1 ? setDisableButton(false) : setDisableButton(true)}
            enableAnnotations
            onPageChanged={(page, pageCount) => {
              setActivePage(page)
              setTotalPage(pageCount)
            }}
          />
          {/* <View style={{ height: '80%' }}> */}

          {/* <ScrollView
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              onScroll={({ nativeEvent }) => {
                if (isCloseToBottom(nativeEvent)) {
                  setDisableButton(false)
                } else {
                  setDisableButton(true)
                }
              }}
              scrollEventThrottle={400}>

              <StyleTextView value={t(AUTH_KEYS.REGISTER.TERMS_AND_CONDITION)} style={{
                fontSize: fontSize.textSmall,
                fontFamily: fontName.regular,
                color: theme.colors.headingTextColor,
                lineHeight: 17,
                marginTop: 10
              }} />
            </ScrollView> */}
          {/* </View> */}



        </View>
        <Image
          style={{
            width: 80, height: 80, position: 'absolute', bottom: '10%',
            backgroundColor: '#4275ef88', borderRadius: 80,
            alignContent:'center',
            alignItems:'center',
            justifyContent:'center',
            left:'40%'
          }}
          source={require('./../../../assets/images/scroll_image.png')} />

        <MainButton
          disabled={disableButton}
          title={t(AUTH_KEYS.REGISTER.AGGREE_CONTINUE)} onPress={() => {
            setAcceptTerms(true)
            setTermsVisible(false)
          }} />

        {termsLoading && <LoaderComponent />}
      </Overlay>
    );
  }

  const overlayDebitCardComponent = (values) => {

    return (
      <Overlay
        isVisible={showDebitCardView}
        onBackdropPress={() => setShowDebitCardView(!showDebitCardView)}
        height='auto'
        overlayStyle={{
          color: theme.colors.mainBackground1,
          margin: 20,
          borderRadius: 10
        }}>
        <TouchableOpacity
          style={{ position: 'absolute', right: -10, top: -10 }}
          onPress={() => {
            setShowDebitCardView(!showDebitCardView)
          }} >
          <CloseIcon />
        </TouchableOpacity>

        <View style={{ justifyContent: 'center', alignItems: 'center', padding: 10 }}>
          <StyleTextView value={t(AUTH_KEYS.REGISTER.DEBIT_CARD_AUTHETICATION)} style={{
            fontSize: fontSize.header2,
            fontFamily: fontName.bold,
            color: theme.colors.headingTextColor,

          }} />
          <Formik
            initialValues={{
              cardNo: "",
              validTill: "",
              cvv: "",
            }}
            validationSchema={() => DebitacardSchema}
            onSubmit={debitCardStep}
          >
            {({
              handleChange,
              handleSubmit,
              values,
              errors,
              touched,
              setFieldValue,
            }) => (
              <View style={{ alignSelf: 'stretch', }}>
                <StyleInputView
                  placeholder={t(AUTH_KEYS.REGISTER.ENTER_CARD_NUMBER)}
                  value={values.cardNo}
                  maxLength={16}
                  touched={touched.cardNo}
                  returnKeyType='done'
                  errors={errors.cardNo}
                  onPress={() => { }}
                  keyboardType='phone-pad'
                  onSubmitEditing={() => focus(1)}
                  setRef={(ref) => {
                    inputRefs[0] = ref
                  }}
                  onChangeText={(text) => {
                    setFieldValue('cardNo', (text))
                  }}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>

                  <StyleInputView
                    placeholder={t(AUTH_KEYS.REGISTER.VALIDATE)}
                    value={values.validTill}
                    touched={touched.validTill}
                    returnKeyType='done'
                    maxLength={5}
                    textInputConatinerStyle={{ width: SIZES.width * 0.75 }}
                    keyboardType='phone-pad'
                    errors={errors.validTill}
                    onPress={() => { }}
                    setRef={(ref) => {
                      inputRefs[1] = ref
                    }}
                    onChangeText={(text) => {
                      if (text.length === 4 && !text.includes('/')) {
                        setFieldValue('validTill', [text.slice(0, 2), '/', text.slice(2)].join(''))
                      } else {
                        setFieldValue('validTill', (text))
                      }
                    }}
                    containerStyle={{ width: '60%' }}
                    onSubmitEditing={() => handleSubmit()}
                  />
                  <StyleInputView
                    placeholder={t(AUTH_KEYS.REGISTER.CVV)}
                    value={values.cvv}
                    maxLength={3}
                    touched={touched.cvv}
                    returnKeyType='done'
                    keyboardType='phone-pad'
                    errors={errors.cvv}
                    onPress={() => { }}
                    setRef={(ref) => {
                      inputRefs[1] = ref
                    }}
                    containerStyle={{ width: '35%' }}
                    onChangeText={(text) => {
                      setFieldValue('cvv', (text))
                    }}
                    onSubmitEditing={() => handleSubmit()}
                  />
                </View>

                {!shwoOTPFiedl &&
                  <MainButton title={t(AUTH_KEYS.REGISTER.GET_OTP)} onPress={() => handleSubmit()} />
                }

                {shwoOTPFiedl &&
                  <StyleTextView value={t(AUTH_KEYS.REGISTER.ENTER_OTP)} style={{
                    fontSize: fontSize.textLarge,
                    fontFamily: fontName.semi_bold,
                    color: theme.colors.headingTextColor,
                    marginTop: 5
                  }} />
                }
                {shwoOTPFiedl &&
                  <View style={{ alignContent: 'center', alignItems: 'center' }}>


                    <SmoothPinCodeInput
                      //password mask="﹡"
                      cellSize={40}
                      codeLength={6}
                      value={otpValue}
                      onTextChange={otpValue => {
                        setOtpValue(otpValue)
                        if (otpValue.length === 6) {
                          setDisableButton(false)
                          Keyboard.dismiss()
                        } else {
                          setDisableButton(true)
                        }
                      }
                      }
                      cellStyle={{
                        borderWidth: 2,
                        borderRadius: 10,
                        borderColor: theme.colors.otpBackground,
                        marginTop: 20,
                        backgroundColor: theme.colors.otpBackground,
                      }}
                      cellStyleFocused={{
                        borderColor: theme.colors.textColor,
                      }}
                      textStyle={{
                        fontSize: fontSize.textNormal,
                        color: theme.colors.headingTextColor,
                        fontFamily: fontName.semi_bold,
                      }}
                      textStyleFocused={{
                        color: theme.colors.headingTextColor
                      }}
                    />
                  </View>
                }
                {shwoOTPFiedl &&

                  <MainButton title={t(AUTH_KEYS.REGISTER.VALIDATE)} onPress={() => {
                    setShowDebitCardView(!showDebitCardView)
                    navigation.navigate(REGISTER.PIN_REGISTER)
                  }} disabled={disableButton} />
                }
              </View>
            )}
          </Formik>


          {/* <MainButton title={"Get Otp"} onPress={() => {
            setAcceptTerms(true)
            setTermsVisible(false)
          }} /> */}
        </View>
      </Overlay>
    );
  }

  const overlayInfoComponent = (values) => {

    return (
      <Overlay
        isVisible={showPANCardView}
        onBackdropPress={() => setShowPANCardView(!showPANCardView)}
        height='auto'
        overlayStyle={{
          color: theme.colors.mainBackground1,
          margin: 10,
          borderRadius: 10,
          width: '80%'
        }}>


        <View style={{ justifyContent: 'center', alignItems: 'center', padding: 15 }}>
          <StyleTextView value={"Looking for your\nCustomer ID ?"} style={{
            fontSize: fontSize.header3,
            fontFamily: fontName.regular,
            color: theme.colors.headingTextColor,
            textAlign: 'center',
            lineHeight: Platform.OS === 'android' ? 23 : 20
          }} />

          <StyleTextView value={"You can easily find it in your\ncheque book,passbook or\neven your account statement"} style={{
            fontSize: fontSize.textNormal,
            fontFamily: fontName.regular,
            color: theme.colors.grey,
            textAlign: 'center',
            marginTop: 10,
            lineHeight: Platform.OS === 'android' ? 22 : 18
          }} />

          <View style={{ borderTopWidth: 1, width: '100%', marginTop: 30, paddingTop: 20, opacity: 0.2 }} />



          <PlainButton title={"Got it"} onPress={() => setShowPANCardView(!showPANCardView)} />
        </View>
      </Overlay>
    );
  }


  return (
    <View style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        keyboardDismissMode='on-drag'
        // extraHeight={60}
        enableAutomaticScroll
        contentContainerStyle={{
          flex: 1,
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
        >
          <AuthHeader title={forgotmPIN ? t(AUTH_KEYS.REGISTER.RESET_MPIN)
            : t(AUTH_KEYS.REGISTER.TITLE)
          }
            navigation={navigation} />
          <Box>

            {forgotmPIN ?
              <View>


                <TitleText style={{
                  color: theme.colors.black,
                  fontSize: fontSize.header2,
                  fontFamily: fontName.medium,
                  marginTop: 30,
                  marginLeft: 10,
                  marginRight: 10,
                  textAlign: 'center',
                  opacity: 0.8
                }}
                  title={t(AUTH_KEYS.REGISTER.FORGOT_MPIN_HEADING)} />

                <TitleText style={{
                  color: theme.colors.black,
                  fontSize: fontSize.textNormal,
                  fontFamily: fontName.regular,
                  marginTop: '5%',
                  marginBottom: '5%',
                  marginLeft: 10,
                  marginRight: 10,
                  opacity: 0.7,
                  textAlign: 'center',
                  lineHeight: 25
                }}
                  title={t(AUTH_KEYS.REGISTER.RESET_MPIN_INFO)} />
              </View>
              :
              <TitleText style={{
                color: theme.colors.black,
                fontSize: fontSize.header3,
                fontFamily: fontName.medium,
                marginVertical: 30,
                marginLeft: 10,
                marginRight: 10,
                textAlign: 'center',
                opacity: 0.8,
                lineHeight: 25
              }}
                title={t(AUTH_KEYS.REGISTER.USER_GUIDE_DESC)} />


            }

            <Formik
              initialValues={{
                custID: "",
                mobileNumber: "",
                checked: t(AUTH_KEYS.PAN_NUMBER),
                panNumber: "",
                isPancard: true,
                acceptTerms: acceptTerms,
                viewTerms: false
              }}
              innerRef={formRef}
              validationSchema={() => checked === 0 ? RegisterOptionSchemaPAN : RegisterOptionSchemaDebitCard}
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
                <View style={{
                  backgroundColor: 'white',
                  elevation: 1,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.1,
                  shadowRadius: 3,
                  margin: 10,
                  paddingHorizontal: 10,
                  borderRadius: 5
                }}>

                  <View style={{ paddingHorizontal: 10 }}>
                    {overlayTermsComponent(values)}

                    {overlayInfoComponent()}

                    <View style={{ justifyContent: 'center' }}>
                      <StyleInputView
                        placeholder={t(AUTH_KEYS.REGISTER.CUSTOMER_ID)}
                        value={values.custID}
                        touched={touched.custID}
                        returnKeyType='done'
                        maxLength={12}
                        textInputConatinerStyle={{ width: SIZES.width * 0.78 }}
                        errors={errors.custID}
                        onPress={() => { }}
                        onSubmitEditing={() => focus(1)}
                        setRef={(ref) => {
                          inputRefs[0] = ref
                        }}
                        onChangeText={(text) => {
                          setFieldValue('custID', (getAlphabetsUpperCaseAndNumbersOnly(text)))
                        }}
                        rightIcon={<TouchableOpacity
                          style={{ flex: 1, position: 'absolute', right: -20, bottom: -30, flexDirection: 'column', padding: 40 }}
                          onPress={() => {
                            setShowPANCardView(!showPANCardView)
                          }} >
                          <MoreInfoIcon />
                        </TouchableOpacity>}
                      />

                    </View>

                    <StyleInputView
                      placeholder={t(AUTH_KEYS.REGISTER.MOBILE_NUMBER)}
                      value={values.mobileNumber}
                      touched={touched.mobileNumber}
                      returnKeyType='done'
                      maxLength={10}
                      keyboardType='phone-pad'
                      textInputConatinerStyle={{ width: SIZES.width * 0.78 }}
                      errors={errors.mobileNumber}
                      onPress={() => { }}
                      setRef={(ref) => {
                        inputRefs[1] = ref
                      }}
                      onChangeText={(text) => {
                        setFieldValue('mobileNumber', (getNumbersOnly(text)))
                      }}
                      onSubmitEditing={() => focus(2)}
                    />

                    <View style={{ flexDirection: 'row', marginTop: 20, }}>
                      {buttons.map((data, key) => {
                        if (checked == key) {
                          return (

                            <TouchableOpacity style={{
                              flexDirection: 'row',
                              // paddingTop: 10,
                              // paddingBottom: 10,
                              alignItems: 'center',
                              // shadowColor: 'black',
                              // shadowOffset: { width: 0, height: 2 },
                              // shadowRadius: 6,
                              // shadowOpacity: 0.26,
                              // elevation: 8,
                              backgroundColor: 'white',
                              borderRadius: 10,
                              marginTop: 10,
                              marginRight: 10,
                            }} onPress={() => {
                              setFieldValue('isPancard', key === 0 ? true : false)
                              setChecked(key)
                              setFieldValue('panNumber', "")
                            }}>
                              <AcceptTermsIcon />
                              <View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                                  {/* {data.icon} */}
                                  <View style={{ flexDirection: 'column' }}>
                                    <StyleTextView value={data.title} style={{
                                      fontSize: fontSize.textNormal,
                                      fontFamily: fontName.regular,
                                      color: theme.colors.black,
                                    }} />
                                    {/* <StyleTextView value={data.desc} style={{
                                fontSize: fontSize.textSmall,
                                fontFamily: fontName.regular,
                                color: theme.colors.textColor,
                              }} /> */}
                                  </View>
                                </View>
                              </View>
                            </TouchableOpacity>)
                        }
                        else {
                          return (
                            <TouchableOpacity style={{
                              flexDirection: 'row',
                              // paddingTop: 10,
                              // paddingBottom: 10,
                              alignItems: 'center',
                              // shadowColor: 'black',
                              // shadowOffset: { width: 0, height: 2 },
                              // shadowRadius: 6,
                              // shadowOpacity: 0.26,
                              // elevation: 8,
                              backgroundColor: 'white',
                              borderRadius: 10,
                              marginTop: 10,
                              marginRight: 10,
                            }} onPress={() => {
                              //setFieldValue('isPancard', false)
                              setFieldValue('isPancard', key === 0 ? true : false)
                              setChecked(key)
                              setFieldValue('panNumber', "")
                            }} >
                              <RadioButtonUncheckedIcon />
                              <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                                {/* {data.icon} */}
                                <View style={{ flexDirection: 'column' }}>
                                  <StyleTextView value={data.title} style={{
                                    fontSize: fontSize.textNormal,
                                    fontFamily: fontName.regular,
                                    color: theme.colors.black,
                                  }} />
                                  {/* <StyleTextView value={data.desc} style={{
                            fontSize: fontSize.textSmall,
                            fontFamily: fontName.regular,
                            color: theme.colors.textColor,
                          }} /> */}
                                </View>
                              </View>
                            </TouchableOpacity>
                          )
                        }
                      })}
                    </View>

                    <StyleInputView
                      placeholder={checked === 0 ? "Ex:XXXXX1234X" : "Last 5 digits of Debit card"}
                      value={values.panNumber}
                      touched={touched.panNumber}
                      returnKeyType='done'
                      autoCapitalize={'characters'}
                      errors={errors.panNumber}
                      onPress={() => { }}
                      keyboardType={checked === 0 ? 'default' : 'phone-pad'}
                      maxLength={checked === 0 ? 10 : 5}
                      textInputConatinerStyle={{ width: SIZES.width * 0.78 }}
                      setRef={(ref) => {
                        inputRefs[2] = ref
                      }}
                      onChangeText={(text) => {
                        setFieldValue('panNumber', checked === 0 ? getAlphabetsUpperCaseAndNumbersOnly(text) : getNumbersOnly(text))
                      }}
                      onSubmitEditing={() => handleSubmit()}
                    />
                    <View style={{ flexDirection: 'row', marginTop: 20, marginBottom: 20, marginRight: 20 }}>
                      <TouchableOpacity
                        disabled={!isVisitedTerms}
                        onPress={() => {
                          setAcceptTerms(!acceptTerms)
                        }}>
                        {/* {acceptTerms ? <AcceptTermsIcon /> : <RadioButtonUncheckedIcon />} */}


                      </TouchableOpacity>
                      {(isVisitedTerms & acceptTerms) ? <AcceptTermsIcon /> : null}
                      <TouchableOpacity
                        style={{ flexDirection: 'row' }}
                        onPress={() => {
                          //setFieldValue('viewTerms', !values.viewTerms)

                          setAcceptTerms(false)
                          setTermsVisible(!isTermsVisible)
                        }} >

                        <StyleTextView value={(isVisitedTerms & acceptTerms) ? "I have Read, I understand & I accept the terms & conditions " : "Click here to read Terms & Conditions"} style={{
                          fontSize: fontSize.textLarge,
                          fontFamily: fontName.medium,
                          color: theme.colors.buttonColor,
                          marginLeft: (isVisitedTerms & acceptTerms) ? 10 : 0
                        }} />
                      </TouchableOpacity>

                    </View>



                    <View />
                    {/* <MainButton title={t(AUTH_KEYS.REGISTER.SUBMIT)} onPress={() => handleSubmit()} disabled={!acceptTerms} /> */}

                  </View>

                </View>
              )}
            </Formik>
          </Box>
        </ScrollView>

        <MainButton noBorder btnContainerStyle={{ width: '100%', position: 'absolute', bottom: 0 }} title={t(AUTH_KEYS.REGISTER.SUBMIT)} disabled={!acceptTerms} onPress={() => {
          if (formRef.current) {
            formRef.current.handleSubmit()
          }
        }
        } />
      </KeyboardAwareScrollView>

      {isLoading && <LoaderComponent />}
    </View>
  );
}



import React, { useEffect, useContext, useState, useCallback, useRef } from "react";
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Text,
  ImageBackground
} from "react-native";
import { fontName, FONTS, colors, SIZES, fontSize } from "../../../styles/global.config";
import { AppContext } from "../../../themes/AppContextProvider";
import { AuthHeader, LoaderComponent, MainButton } from "../../components";
import StyleTextView from "../../components/input/StyleTextView";
import { useTranslation } from 'react-i18next';
import { AUTH_KEYS } from '../../../assets/translations/constants';
import { Switch } from 'react-native-switch';
import { SERVICES } from "../../routes";
import { AddPayeeIcon, RadioButtonUncheckedIcon, AcceptTermsIcon } from '../../../assets/svg'
import { biometricStatusSelector } from "../../store/selectors";
import { AccountDropDownView, BCBDropDownView } from '../../components';
import { getAccountDetailsSelector, userDetailsSelector } from "../../store/selectors";
import { useSelector } from "react-redux";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import StyleInputView from "../../components/input/StyleInputView";
import { Formik } from 'formik';
import { showMessage } from "react-native-flash-message";
import Services from '../../api/Services'
import PlainButton from "../../components/button/PlainButton";
import { Overlay } from 'react-native-elements';
import {
  chequePreview,
  chequeAccPreview
} from '../../../assets/images';
import * as Yup from 'yup'
export default function NewChequeBookScreen({ navigation, route }) {
  const checkBiometricStaus = useSelector(biometricStatusSelector)
  const [counter, setCounter] = useState(0);
  const [personalise, setPersonalise] = useState(false);
  const { theme } = useContext(AppContext)
  const [isLoading, setLoading] = useState(false);
  const setFieldValueRef = useRef(null)
  const accDetailsData = useSelector(getAccountDetailsSelector);
  const accountTypes = ["CA", "SB", "OD"];
  const [accountList, setAccountList] = useState(accDetailsData.length > 0 ? accDetailsData.filter(v => accountTypes.indexOf(v.acctType) > -1) : []);
  const [srcAccount, setSrcAccount] = useState('');
  const [noOfLeaves, setNoOfLeaves] = useState('');
  const [chequeLeaveList, setLeaveList] = useState([]);
  const [nameCount, setNameCount] = useState(0);
  const userDetails = useSelector(userDetailsSelector)
  const [isRetailLogin, setRetailLogin] = useState(userDetails?.retail);
  const [accountPrint, setAccountPrint] = useState(false);
  const namePrefixes = ["Second name ", "Third name"]
  const { t, i18n } = useTranslation();
  const [preViewScreen, setPreviewScreen] = useState(false);
  const [preViewScreenDetail, setPreviewScreenDetail] = useState(false);
  const [dynamicName, setDynamicName] = useState([{ label: t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.NAME), value: '', }]);
  const [customerAddres, setCustAddress] = useState('');
  const [remarksList, setRemarksList] = useState([]);
  const leavesListApi = useCallback(async (accountNo, setFieldValue) => {
    try {
      let request = {
        accountNo: accountNo
      };
      setLoading(true);
      const response = await Services.getLeavesListApi(request);
      setLeaveList(response.leaves);
      setFieldValue('dynamicName', [{ label: t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.NAME), value: response.customerName, }])
      setCustAddress(response.customerAddress)
      setFieldValue('nameOfCompany', response.customerName)
      setLoading(false);
    } catch (error) {
      setLoading(false);
      showMessage({
        message: "",
        description: error.message || error.error,
        type: "danger",
        hideStatusBar: true,
        backgroundColor: "black", // background color
        color: "white", // text color
      });
    }
  },
    [navigation,])
  const chequeBookRemarksApiCall = useCallback(async () => {
    try {
      let request = {
        "module": "CHEQUEBOOK",
        "requestId": "CHEQUEBOOKREMARKS",
      }
      setLoading(true);
      const response = await Services.chequeBookRemarks(request);
      setRemarksList(response)
      setLoading(false);
    } catch (error) {
      setLoading(false);
      showMessage({
        message: "",
        description: error.message || error.error,
        type: "danger",
        hideStatusBar: true,
        backgroundColor: "black", // background color
        color: "white", // text color
      });
    }
  },
    [navigation,])
  useEffect(() => {
    chequeBookRemarksApiCall()
  }, [])
  const overlayComponent = () => {
    return (
      <Overlay
        isVisible={preViewScreen}
        onBackdropPress={() => setPreviewScreen(false)}
        overlayStyle={{ width: SIZES.width * 0.9, height: 300 }}
      >

        <ImageBackground
          resizeMode='contain'
          source={accountPrint ? chequeAccPreview : chequePreview}
          style={{ width: SIZES.width * 0.85, height: 150 }}

        >
          <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10, marginHorizontal: 10 }}>
            <StyleTextView style={{ textAlign: 'center', alignSelf: 'center', color: colors.textColor, fontFamily: fontName.medium, marginLeft: 10, fontSize: 12 }}
              value={`${preViewScreenDetail.acctNo}`}
            />
            <StyleTextView style={{ textAlign: 'center', alignSelf: 'center', color: colors.textColor, fontFamily: fontName.medium, marginLeft: 10, fontSize: 12 }}
              value={`${'No of leaves'} ${preViewScreenDetail.noOfLeaves}`}
            />
          </View>
          <View style={{ position: 'absolute', bottom: 0, right: 0, width: '50%', padding: 10 }}>
            {isRetailLogin === false && (<>
              <StyleTextView style={{ textAlign: 'center', alignSelf: 'center', color: colors.textColor, fontFamily: fontName.medium, marginLeft: 10, fontSize: 12 }}
                value={preViewScreenDetail.nameOfCompany}
              />
              <StyleTextView style={{ textAlign: 'center', alignSelf: 'center', color: colors.textColor, fontFamily: fontName.medium, marginLeft: 10, fontSize: 10 }}
                value={preViewScreenDetail.authSignatory}
              />
              <StyleTextView style={{ textAlign: 'center', alignSelf: 'center', color: colors.textColor, fontFamily: fontName.medium, marginLeft: 10, fontSize: 10 }}
                value={preViewScreenDetail.designation}
              />
            </>)}
            {isRetailLogin === true && (<>
              {preViewScreenDetail?.dynamicName?.map(v => {
                return (
                  <StyleTextView style={{ textAlign: 'center', alignSelf: 'center', color: colors.textColor, fontFamily: fontName.medium, marginLeft: 10, fontSize: 12 }}
                    value={v.value}
                  />
                )
              })

              }

            </>)}

          </View>

        </ImageBackground>
        <StyleTextView value={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.PREVIEW_CHEQUE_BOOK)} style={{
          fontFamily: fontName.medium,
          color: theme.colors.textColor,
          fontSize: fontSize.textLarge,
          textAlign: 'center',
          marginTop: 20,
        }} />
        <StyleTextView value={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.CONFIRM_PREVIEW)} style={{
          fontFamily: fontName.medium,
          color: theme.colors.textColor,
          fontSize: fontSize.medium,
          opacity: 0.85,
          marginHorizontal: 10,
          textAlign: 'center',
          marginBottom: 20
        }} />
        <PlainButton
          title={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.CLOSE_CHEQUE_BOOK_REQUEST)}
          onPress={() => {
            setPreviewScreen(false)
          }}
          titleStyle={{ ...FONTS.h3, textAlign: 'center', alignSelf: 'center', color: colors.textColor, fontFamily: fontName.medium, marginLeft: 10 }}
        />
      </Overlay>
    );
  }
  const nextButton = useCallback(async (data) => {
    try {
      const account = accDetailsData.find(v => v.acctNo === srcAccount);
      navigation.navigate(SERVICES.NEW_CHEQUE_BOOK_CONFIRM, { ...data, ...account, customerAddres, accountPrint })
    } catch (error) {
      setLoading(false);
      showMessage({
        message: "",
        description: error.message || error.error,
        type: "danger",
        hideStatusBar: true,
        backgroundColor: "black", // background color
        color: "white", // text color
      });
    }
  },
    [navigation, customerAddres])
  const chequeBookSchema = Yup.object().shape({
    acctNo: Yup.string()
      .required(t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.PLEASE_SELECT_ACCOUNT)),
    noOfLeaves: Yup.string()
      .required(t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.PLEASE_SELECT_NO_OF_LEAVES)),
  })
  return (
    <SafeAreaView
      style={{
        flex: 1,
        width: SIZES.width,

      }}>
      <KeyboardAwareScrollView
        keyboardDismissMode='on-drag'
        contentContainerStyle={{
          flex: 1,

        }}
      >
        <AuthHeader title={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.NEW_CHEQUE_BOOK)}
          navigation={navigation}
        />
        {overlayComponent()}
        <Formik
          initialValues={{

            dynamicName: dynamicName,
            agencyLogo: '',
            nameOfCompany: '',
            authSignatory: '',
            designation: '',
            acctNo: '',
            personalise: false,
            noOfLeaves: '',
            remarks: ''

          }}
          onSubmit={nextButton}
          validationSchema={chequeBookSchema}
          validateOnChange>
          {({
            handleChange,
            handleSubmit,
            handleBlur,
            values,
            errors,
            touched,
            setFieldValue,
          }) => (<View style={{ backgroundColor: theme.colors.bgColor, flex: 1, paddingHorizontal: 15, paddingTop: 20, paddingBottom: 100 }}>
            <ScrollView
              showsVerticalScrollIndicator={false}>

              <StyleTextView value={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.NEW_CHEQUE_BOOK_DESC)} style={{
                fontFamily: fontName.medium,
                color: theme.colors.textColor,
                fontSize: fontSize.textLarge,
                textAlign: 'center',
                lineHeight: 25,
                marginTop: 20,
                marginBottom: 20
              }} />


              <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
                <AccountDropDownView
                  data={accountList}
                  placeholder={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.FOR_ACCOUNT)}
                  dropDownlabel={'acctNo'}
                  dropDownValue={"acctNo"}
                  value={srcAccount}
                  editable={false}
                  // touched={sendViaError}
                  returnKeyType='done'
                  keyboardType='phone-pad'
                  // errors={sendViaError}
                  onChangeText={(text) => {
                    setFieldValue('acctNo', text)
                    setSrcAccount(text)
                    setFieldValueRef.current = setFieldValue
                    leavesListApi(text, setFieldValue);

                  }} />
                <BCBDropDownView
                  data={chequeLeaveList.map(v => {
                    return { label: v, value: v }
                  })}
                  placeholder={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.NO_OF_LEAVES)}
                  dropDownlabel={"label"}
                  dropDownValue={"label"}
                  selectedValue={noOfLeaves}
                  value={noOfLeaves}
                  editable={false}
                  onChangeText={(text) => {
                    setNoOfLeaves(text)
                    setFieldValue('noOfLeaves', text)
                  }}
                />

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                  <StyleTextView style={{ ...FONTS.h3, fontSize: fontSize.textLarge, textAlign: 'center', alignSelf: 'center', color: colors.buttonColor, fontFamily: fontName.medium }}
                    value={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.PERSONALISE_CHEQUE_BOOK)}
                  />
                  <Switch
                    value={values.personalise}
                    activeText={""}
                    renderInActiveText={false}
                    inactiveTextStyle={""}
                    barHeight={20}
                    circleSize={20}
                    backgroundActive={theme.colors.buttonColor}
                    onValueChange={(val) => {
                      setNameCount(0)
                      setFieldValue('personalise', !values.personalise)
                      setFieldValue('dynamicName', [{ label: t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.NAME), value: values.dynamicName[0].value, }])
                    }
                    }
                  />
                </View>
                {isRetailLogin === false && (<StyleInputView
                  placeholder={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.NAME_OF_THE_COMPANY)}
                  onChangeText={(text) => {
                    setFieldValue('nameOfCompany', text)
                  }}
                  onBlur={(text) => {
                    setFieldValue('nameOfCompany', text)
                  }}
                  value={values.nameOfCompany}
                />)}
                {isRetailLogin === false && (<StyleInputView
                  placeholder={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.NAME_OF_THE_AUTHORIZED_SING)}
                  disabled
                  onChangeText={(text) => {
                    setFieldValue('authSignatory', text)
                  }}
                  onBlur={(text) => {
                    setFieldValue('authSignatory', text)
                  }}
                  value={values.authSignatory}
                />)}
                {isRetailLogin === false && (<StyleInputView
                  placeholder={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.DESIGNATION)}
                  onChangeText={(text) => {
                    setFieldValue('designation', text)
                  }}
                  onBlur={(text) => {
                    setFieldValue('designation', text)
                  }}
                  value={values.designation}
                />)}

                {isRetailLogin && values.dynamicName.map(({ label }, index) => {
                  return (<StyleInputView
                    placeholder={label}
                    editable={values.personalise}
                    onChangeText={handleChange(`dynamicName[${index}].value`)}
                    onBlur={handleBlur(`dynamicName[${index}].value`)}
                    value={values.dynamicName[index].value}
                  />)
                })}

              </View>
              {nameCount <= 1 && values.personalise && isRetailLogin &&
                (<TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center', marginTop: 30, marginLeft: 20 }}
                  onPress={() => {
                    setNameCount(nameCount + 1)
                    setFieldValue('dynamicName', [
                      ...values.dynamicName,
                      { label: `${namePrefixes[nameCount]}`, value: '' },
                    ])
                  }}
                >
                  <AddPayeeIcon />
                  <StyleTextView style={{ ...FONTS.h3, textAlign: 'center', alignSelf: 'center', color: colors.buttonColor, fontFamily: fontName.medium, marginLeft: 10 }}
                    value={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.ADD_ANOTHER_NAME)}
                  />
                </TouchableOpacity>)
              }
              {/* <BCBDropDownView
                data={remarksList}
                placeholder={"Remarks"}
                dropDownlabel={"remarkDescription"}
                dropDownValue={"remarkDescriptionl"}
                selectedValue={values.remarks}
                value={values.remarks}
                editable={false}
                onChangeText={(text) => {
                  setFieldValue('remarks', text)
                }}
              /> */}
              {isRetailLogin === false && (<TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', marginTop: 30, marginLeft: 20 }}
                onPress={() => {
                  setAccountPrint(!accountPrint)
                }}
              >
                {accountPrint ? <AcceptTermsIcon /> : <RadioButtonUncheckedIcon />}
                <StyleTextView style={{ textAlign: 'center', alignSelf: 'center', color: colors.textColor, fontFamily: fontName.medium, marginLeft: 10 }}
                  value={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.ACCOUNT_PAYEE_TO_BE_PRINTED_ON_CHEQUES)}
                />
              </TouchableOpacity>)}

            </ScrollView>
            <PlainButton
              title={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.PREVIEW_DETAILS)}
              onPress={() => {
                setPreviewScreen(true)
                setPreviewScreenDetail(values)
              }}
              titleStyle={{ ...FONTS.h3, textAlign: 'center', alignSelf: 'center', color: colors.textColor, fontFamily: fontName.medium, marginLeft: 10 }}
            />
            <MainButton
              disabled={false}
              title={t(AUTH_KEYS.FUND_TRANSFER.PROCEED)}
              noBorder
              btnContainerStyle={{ width: SIZES.width, position: 'absolute', bottom: 0 }}
              onPress={handleSubmit}


            />
          </View>)}
        </Formik>
        {isLoading && <LoaderComponent />}
      </KeyboardAwareScrollView>
    </SafeAreaView>

  );
}



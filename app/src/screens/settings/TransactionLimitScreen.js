import React, { useEffect, useContext, useState, useCallback } from "react";
import {
  View,
  Image,
  StyleSheet,
  ScrollView
} from "react-native";
import { fontName, fontSize } from "../../../styles/global.config";
import LinearGradient from 'react-native-linear-gradient';
import { AppContext } from "../../../themes/AppContextProvider";
import { LogoIcon, SplashScreenIcon } from "../../../assets/svg";
import TitleText from "../../components/base/TitleText";
import { GET_STARTED, SETTINGS } from "../../routes";
import { AuthHeader, BCBDropDownView, LoaderComponent, MainButton } from "../../components";
import StyleTextView from "../../components/input/StyleTextView";
import { Switch } from 'react-native-switch';
import PlainButton from "../../components/button/PlainButton";
import { Overlay } from 'react-native-elements'
import Slider from "react-native-slider";
import { useTranslation } from 'react-i18next';
import { currencyFormat } from "../../utils/amount-util";
import BCBSourceAccountDropDown from "../../components/dropdown/BCBSourceAccountDropDown";
import Home from "../../api/dashboard";
import { showMessage, hideMessage } from "react-native-flash-message";
import { useSelector } from "react-redux";
import { profileSelector } from "../../store/selectors";
import { AUTH_KEYS } from "../../../assets/translations/constants";

export default function TransactionLimitScreen({ navigation, route }) {

  const { theme, changeTheme } = useContext(AppContext)
  const { t, i18n } = useTranslation();
  const [selectedAccValue, setSelectedAccValue] = useState('');
  const [isValueChanged, setValueChanged] = useState(true);

  const [showSuccessAlert, setShowSuccessAlert] = useState(false)

  const [showConfirmAlert, setShowConfirmAlert] = useState(false)


  const profileData = useSelector(profileSelector)

  //const profileData = route.params.profileData
  const [iatLimit, setIATLimit] = useState(1);
  const [impsLimit, setImpsLimit] = useState(1);

  const [neftLimit, setNeftLimit] = useState(1);

  const [rtgsLimit, setRtgsLimit] = useState(1);
  const [upiLimit, setUPILimit] = useState(1);
  const [iatMinLimit, setIATMinLimit] = useState(0);
  const [iatMaxLimit, setIATMaxLimit] = useState(500000);


  const [impsMinLimit, setImpsMinLimit] = useState(0);
  const [impsMaxLimit, setImpsMaxLimit] = useState(500000);

  const [neftMinLimit, setNeftMinLimit] = useState(0);
  const [neftMaxLimit, setNeftMaxLimit] = useState(1000000);


  const [rtgsMinLimit, setRtgsMinLimit] = useState(0);
  const [rtgsMaxLimit, setRtgsMaxLimit] = useState(1000000);

  const [upiMinLimit, setUPIMinLimit] = useState(0);
  const [upiMaxLimit, setUPIMaxLimit] = useState(1000000);
  const [isLoading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState([])

  const [successResponseData, setSuccessResponseData] = useState([])

  useEffect(() => {
    getTransactionLimit()
  }, []);



  const getTransactionLimit = useCallback(async () => {

    try {
      setLoading(true);
      let request = {
        profileId: profileData.profileId,
      }
      const response = await Home.getTransactionLimitApi(request);
      setLoading(false);
      setResponseData(response.txnLimits)
      setImpsMaxLimit(response.maxImpsLimit)
      setNeftMaxLimit(response.maxNeftLimit)
      setRtgsMaxLimit(response.maxRtgsLimit)
      setIATMaxLimit(response.iatLimit);
      setUPIMaxLimit(response.upiLimit)
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

  const updateTransactionLimit = useCallback(async (data) => {

    try {
      setLoading(true);
      let request = {
        accountNo: selectedAccValue,
        impsLimit: impsLimit,
        neftLimit: neftLimit,
        rtgsLimit: rtgsLimit,
        "iatLimit": iatLimit,
        "upiLimit": upiLimit,


        profileId: profileData.profileId,
      }
      const response = await Home.updateTransactionLimitApi(request);
      setLoading(false);

      setSuccessResponseData(response)
      setShowSuccessAlert(true)

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
    [navigation, selectedAccValue, impsLimit, neftLimit, rtgsLimit,iatLimit,upiLimit]
  );

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


        <View style={{ padding: 15, marginTop: 10 }}>
          <StyleTextView value={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.TRANSATION_LIMIT_UPDATED)} style={{
            fontSize: fontSize.textLarge,
            fontFamily: fontName.medium,
            color: theme.colors.headingTextColor,

          }} />

          <StyleTextView value={successResponseData.message} style={{
            fontSize: fontSize.textNormal,
            fontFamily: fontName.regular,
            marginTop: 10,
            color: theme.colors.grey,
            lineHeight: 20,
            marginBottom: 40,
            marginTop: 20
          }} />



          <View style={{ position: 'absolute', bottom: 20, right: 10 }}>
            <PlainButton title={"Okay !"}
              style={{ fontFamily: fontName.medium }}
              onPress={() => {
                setShowSuccessAlert(!showSuccessAlert)
                navigation.goBack()

              }

              } />
          </View>


        </View>
      </Overlay>
    );
  }

  const confirmAlertUI = (values) => {

    return (
      <Overlay
        isVisible={showConfirmAlert}
        onBackdropPress={() => setShowConfirmAlert(!showConfirmAlert)}
        height='auto'
        overlayStyle={{
          color: theme.colors.mainBackground1,
          width: '90%'
        }}>


        <View style={{ padding: 15, marginTop: 20 }}>
          <StyleTextView value={"Save changes?"} style={{
            fontSize: fontSize.textLarge,
            fontFamily: fontName.medium,
            color: theme.colors.headingTextColor,

          }} />

          <StyleTextView value={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.LIKE_TO_SAVE_TRANSACTION_LIMIT)} style={{
            fontSize: fontSize.textNormal,
            fontFamily: fontName.regular,
            color: theme.colors.grey,
            marginTop: 10,
            lineHeight: 20,
            marginBottom: 40,
            marginTop: 20,
          }} />



          <View style={{ position: 'absolute', bottom: 20, right: 20, flexDirection: 'row' }}>
            <PlainButton
              titleStyle={{ color: theme.colors.grey }}
              style={{ marginRight: 60, color: theme.colors.grey, fontFamily: fontName.medium }}
              title={"Ignore"} onPress={() => {
                setShowConfirmAlert(!showConfirmAlert)
              }
              } />

            <PlainButton title={t(AUTH_KEYS.PAY_PEOPLE.SAVE)}
              style={{ fontFamily: fontName.medium }}
              onPress={() => {
                setShowConfirmAlert(!showConfirmAlert)
                updateTransactionLimit(selectedAccValue)
              }
              } />
          </View>


        </View>
      </Overlay>
    );
  }

  return (

    <View style={{
      flex: 1,
      backgroundColor: theme.colors.white,
    }}>

      <AuthHeader title={t(AUTH_KEYS.PAY_PEOPLE.TRANSACTION_LIMIT)}
        navigation={navigation}
      />

      {successAlertUI()}
      {confirmAlertUI()}

      <ScrollView>
        <View style={{
          //alignItems: 'center',
          margin: 20,
        }}>


          <StyleTextView value={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.CUSTOMIZED_LIMIT)} style={{
            fontSize: fontSize.header3,
            fontFamily: fontName.medium,
            color: theme.colors.headingTextColor,
            textAlign: 'center',
            marginLeft: 10,
            marginRight: 10,
            lineHeight: 20,
            opacity: 0.8
          }} />
          <StyleTextView value={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.DISCRIPTION_MSG_TRANSACTION_LIMIT)} style={{
            fontSize: fontSize.textNormal,
            fontFamily: fontName.regular,
            color: theme.colors.headingTextColor,
            opacity: .8,
            lineHeight: 20,
            marginTop: 20,
            marginBottom: 20
          }} />

        </View>

        <View style={{
          marginLeft: 20,
          marginRight: 20,
          flex: 1,
          flexDirection: 'column'
        }}>

          <BCBSourceAccountDropDown
            text={t(AUTH_KEYS.MAIN_SCREEN.SELECT_ACCOUNT)}
            data={responseData}
            value={selectedAccValue}
            dropDownlabel={'accountNo'}
            dropDownValue={"accountNo"}
            placeholder={t(AUTH_KEYS.MAIN_SCREEN.SELECT_ACCOUNT)}
            onChangeText={item => {
              setSelectedAccValue(item)
              setImpsLimit(responseData.filter(v => v.accountNo === item)[0].impsLimit)
              setNeftLimit(responseData.filter(v => v.accountNo === item)[0].neftLimit)
              setRtgsLimit(responseData.filter(v => v.accountNo === item)[0].rtgsLimit)
              setIATLimit(responseData.filter(v => v.accountNo === item)[0].iatLimit)
              setUPILimit(responseData.filter(v => v.accountNo === item)[0].upiLimit)
            }}

          />

          {/* <BCBDropDownView
            data={responseData.map(v => {
              return ({
                label: v.accountNo,
                value: v.accountNo,
              })
            })}
            sty
            placeholder={"Choose Option"}
            dropDownlabel={"label"}
            dropDownValue={"value"}
            value={selectedAccValue}
            editable={false}
            onChangeText={(item) => {
              setSelectedAccValue(item)
              setImpsLimit(responseData.filter(v => v.accountNo === item)[0].impsLimit)
              setNeftLimit(responseData.filter(v => v.accountNo === item)[0].neftLimit)
              setRtgsLimit(responseData.filter(v => v.accountNo === item)[0].rtgsLimit)
            }} /> */}
          <StyleTextView value={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.WITHIN_BANK_LIMIT)} style={{
            fontSize: fontSize.textNormal,
            fontFamily: fontName.medium,
            color: theme.colors.grey,
            lineHeight: 20,
            marginTop: 20,
            marginHorizontal: 10
          }} />

          <StyleTextView value={currencyFormat(iatLimit, "INR")} style={{
            fontSize: fontSize.textNormal,
            fontFamily: fontName.medium,
            color: theme.colors.headingTextColor,
            opacity: .8,
            lineHeight: 20,
            marginTop: 5,
            marginHorizontal: 10
          }} />
          <Slider
            minimumValue={iatMinLimit}
            maximumValue={iatMaxLimit}
            step={10000}
            style={{ marginHorizontal: 10 }}
            minimumTrackTintColor={theme.colors.buttonStrokeStartColor}
            maximumTrackTintColor='#d3d3d3'
            thumbTintColor={theme.colors.buttonColor}
            value={iatLimit}
            onValueChange={(value) => {
              setValueChanged(false)
              setIATLimit(value)
            }
            }
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10 }}>
            <StyleTextView value={currencyFormat(iatMinLimit)} style={{
              fontSize: fontSize.textNormal,
              fontFamily: fontName.regular,
              color: theme.colors.headingTextColor,
              opacity: .8,
              lineHeight: 20,
            }} />

            <StyleTextView value={currencyFormat(iatMaxLimit)} style={{
              fontSize: fontSize.textNormal,
              fontFamily: fontName.regular,
              color: theme.colors.headingTextColor,
              opacity: .8,
              lineHeight: 20,
            }} />
          </View>
          <StyleTextView value={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.IMPS_LIMIT)} style={{
            fontSize: fontSize.textNormal,
            fontFamily: fontName.medium,
            color: theme.colors.grey,
            lineHeight: 20,
            marginTop: 20,
            marginHorizontal: 10
          }} />

          <StyleTextView value={currencyFormat(impsLimit, "INR")} style={{
            fontSize: fontSize.textNormal,
            fontFamily: fontName.medium,
            color: theme.colors.headingTextColor,
            opacity: .8,
            lineHeight: 20,
            marginTop: 5,
            marginHorizontal: 10
          }} />
          <Slider
            minimumValue={impsMinLimit}
            maximumValue={impsMaxLimit}
            step={10000}
            style={{ marginHorizontal: 10 }}
            minimumTrackTintColor={theme.colors.buttonStrokeStartColor}
            maximumTrackTintColor='#d3d3d3'
            thumbTintColor={theme.colors.buttonColor}
            value={impsLimit}
            onValueChange={(value) => {
              setValueChanged(false)
              setImpsLimit(value)
            }
            }
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10 }}>
            <StyleTextView value={currencyFormat(impsMinLimit)} style={{
              fontSize: fontSize.textNormal,
              fontFamily: fontName.regular,
              color: theme.colors.headingTextColor,
              opacity: .8,
              lineHeight: 20,
            }} />

            <StyleTextView value={currencyFormat(impsMaxLimit)} style={{
              fontSize: fontSize.textNormal,
              fontFamily: fontName.regular,
              color: theme.colors.headingTextColor,
              opacity: .8,
              lineHeight: 20,
            }} />
          </View>


          <StyleTextView value={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.NEFT_LIMIT)} style={{
            fontSize: fontSize.textNormal,
            fontFamily: fontName.medium,
            color: theme.colors.grey,
            lineHeight: 20,
            marginTop: 20,
            marginHorizontal: 10
          }} />

          <StyleTextView value={currencyFormat(neftLimit, "INR")} style={{
            fontSize: fontSize.textNormal,
            fontFamily: fontName.medium,
            color: theme.colors.headingTextColor,
            opacity: .8,
            lineHeight: 20,
            marginTop: 5,
            marginHorizontal: 10
          }} />
          <Slider
            minimumValue={neftMinLimit}
            maximumValue={neftMaxLimit}
            step={10000}
            style={{ marginHorizontal: 10 }}
            minimumTrackTintColor={theme.colors.buttonStrokeStartColor}
            maximumTrackTintColor='#d3d3d3'
            thumbTintColor={theme.colors.buttonColor}
            value={neftLimit}
            onValueChange={(value) => {
              setValueChanged(false)
              setNeftLimit(value)
            }
            }
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10 }}>
            <StyleTextView value={currencyFormat(neftMinLimit)} style={{
              fontSize: fontSize.textNormal,
              fontFamily: fontName.regular,
              color: theme.colors.headingTextColor,
              opacity: .8,
              lineHeight: 20,
            }} />

            <StyleTextView value={currencyFormat(neftMaxLimit)} style={{
              fontSize: fontSize.textNormal,
              fontFamily: fontName.regular,
              color: theme.colors.headingTextColor,
              opacity: .8,
              lineHeight: 20,
            }} />
          </View>

          <StyleTextView value={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.RTGS_LIMIT)} style={{
            fontSize: fontSize.textNormal,
            fontFamily: fontName.medium,
            color: theme.colors.grey,
            lineHeight: 20,
            marginTop: 20,
            marginHorizontal: 10
          }} />

          <StyleTextView value={currencyFormat(rtgsLimit, "INR")} style={{
            fontSize: fontSize.textNormal,
            fontFamily: fontName.medium,
            color: theme.colors.headingTextColor,
            opacity: .8,
            lineHeight: 20,
            marginTop: 5,
            marginHorizontal: 10
          }} />
          <Slider
            minimumValue={rtgsMinLimit}
            maximumValue={rtgsMaxLimit}
            step={10000}
            style={{ marginHorizontal: 10 }}
            minimumTrackTintColor={theme.colors.buttonStrokeStartColor}
            maximumTrackTintColor='#d3d3d3'
            thumbTintColor={theme.colors.buttonColor}
            value={rtgsLimit}
            onValueChange={(value) => {
              setValueChanged(false)
              setRtgsLimit(value)
            }
            }
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10 }}>
            <StyleTextView value={currencyFormat(rtgsMinLimit)} style={{
              fontSize: fontSize.textNormal,
              fontFamily: fontName.regular,
              color: theme.colors.headingTextColor,
              opacity: .8,
              lineHeight: 20,
            }} />

            <StyleTextView value={currencyFormat(rtgsMaxLimit)} style={{
              fontSize: fontSize.textNormal,
              fontFamily: fontName.regular,
              color: theme.colors.headingTextColor,
              opacity: .8,
              lineHeight: 20,
            }} />
          </View>
          <StyleTextView value={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.UPI_LIMIT)} style={{
            fontSize: fontSize.textNormal,
            fontFamily: fontName.medium,
            color: theme.colors.grey,
            lineHeight: 20,
            marginTop: 20,
            marginHorizontal: 10
          }} />

          <StyleTextView value={currencyFormat(upiLimit, "INR")} style={{
            fontSize: fontSize.textNormal,
            fontFamily: fontName.medium,
            color: theme.colors.headingTextColor,
            opacity: .8,
            lineHeight: 20,
            marginTop: 5,
            marginHorizontal: 10
          }} />
          <Slider
            minimumValue={upiMinLimit}
            maximumValue={upiMaxLimit}
            step={10000}
            style={{ marginHorizontal: 10 }}
            minimumTrackTintColor={theme.colors.buttonStrokeStartColor}
            maximumTrackTintColor='#d3d3d3'
            thumbTintColor={theme.colors.buttonColor}
            value={upiLimit}
            onValueChange={(value) => {
              setValueChanged(false)
              setUPILimit(value)
            }
            }
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10 }}>
            <StyleTextView value={currencyFormat(upiMinLimit)} style={{
              fontSize: fontSize.textNormal,
              fontFamily: fontName.regular,
              color: theme.colors.headingTextColor,
              opacity: .8,
              lineHeight: 20,
            }} />

            <StyleTextView value={currencyFormat(upiMaxLimit)} style={{
              fontSize: fontSize.textNormal,
              fontFamily: fontName.regular,
              color: theme.colors.headingTextColor,
              opacity: .8,
              lineHeight: 20,
            }} />
          </View>
        </View>
      </ScrollView>

      <MainButton
        noBorder={true}
        disabled={selectedAccValue.length === 0 ? true : isValueChanged}
        btnContainerStyle={{ width: '100%' }} title={t(AUTH_KEYS.PAY_PEOPLE.SAVE)} onPress={() => {

          setShowConfirmAlert(true)
        }} />

      {isLoading && <LoaderComponent />}
    </View>

  );
}



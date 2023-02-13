import React, { useEffect, useContext, useState, useCallback } from "react";
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Text
} from "react-native";
import { fontName, FONTS, fontSize } from "../../../styles/global.config";
import LinearGradient from 'react-native-linear-gradient';
import { AppContext } from "../../../themes/AppContextProvider";
import { CheckedIcon, DownArrowIcon, LogoIcon, MoreInfoIcon, SelectDownArrowIcon, SplashScreenIcon, TickIcon, UnCheckIcon } from "../../../assets/svg";
import TitleText from "../../components/base/TitleText";
import { GET_STARTED, SETTINGS } from "../../routes";
import { AuthHeader, LoaderComponent, MainButton } from "../../components";
import StyleTextView from "../../components/input/StyleTextView";
import { Switch } from 'react-native-switch';
import PlainButton from "../../components/button/PlainButton";
import { Overlay } from 'react-native-elements'
import Slider from "react-native-slider";
import { currencyFormat } from "../../utils/amount-util";
import BCBSourceAccountDropDown from "../../components/dropdown/BCBSourceAccountDropDown";
import Home from "../../api/dashboard";
import { showMessage, hideMessage } from "react-native-flash-message";
import StyleInputView from "../../components/input/StyleInputView";
import { getAccountDetailsSelector, profileSelector } from "../../store/selectors";
import { useSelector } from "react-redux";
import { SET_ACC_DETAILS } from "../../store/constants";
import { store } from "../../store";
import { t } from "i18next";
import { AUTH_KEYS } from "../../../assets/translations/constants";
export default function SetPrimaryAccountScreen({ navigation, route }) {

  const { theme, changeTheme } = useContext(AppContext)



  const [showSuccessAlert, setShowSuccessAlert] = useState(false)

  const [showConfirmAlert, setShowConfirmAlert] = useState(false)

  const profileData = useSelector(profileSelector)

  const accDetailsData = useSelector(getAccountDetailsSelector);
  const [selectedAcc, setSelectedAcc] = useState(accDetailsData.find(v => v.primaryAccount === true).acctNo || '');
  const accountTypes = ["CA", "SB", "OD"];

  const [accDetails, setAccDetails] = useState(accDetailsData.filter(v => accountTypes.indexOf(v.acctType) > -1) || []);

  const [accFilterList, setAccFilterList] = useState([]);


  const [isLoading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState([])

  const [successResponseData, setSuccessResponseData] = useState([])
  const getTransactionLimit = useCallback(async () => {

    try {
      setLoading(true);
      let request = {
        profileId: profileData.profileId,
      }
      const response = await Home.getTransactionLimitApi(request);
      setLoading(false);
      setResponseData(response.txnLimits)
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
  useEffect(() => {
    const dummyData = accDetails
    let arr = dummyData.map((items, ind) => {
      if (items.primaryAccount === true) {
        items.isSelected = true
        // setSelectedAcc(items.acctNo)
      }
      else {
        items.isSelected = false
      }
      return { ...items }
    })
    setAccDetails(arr)
    setAccFilterList(arr)
  }, [])
  const setPrimaryAccountCall = useCallback(async (data) => {
    const selectedAccount = accDetails.find(V => V.isSelected === true)
    try {
      setLoading(true);
      let request = {
        accountNo: selectedAccount.acctNo,
        profileId: profileData.profileId,
      }
      const response = await Home.setPrimaryAccountApi(request);
      setLoading(false);
      setShowConfirmAlert(false)
      const dummyData = accDetailsData
      let arr = dummyData.map((items, ind) => {
        if (items.acctNo === selectedAccount.acctNo) {
          items.primaryAccount = true
          setSelectedAcc(items.acctNo)
        }
        else {
          items.primaryAccount = false
        }
        return { ...items }
      })
      store.dispatch({ type: SET_ACC_DETAILS, payload: [...arr.filter(v => v.acctNo === selectedAcc), ...arr.filter(v => v.acctNo !== selectedAcc)] });
      showMessage({
        message: "Primary account",
        description: response.message,
        type: "default",
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
    [navigation, selectedAcc, accDetails]
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
            opacity: .6,
            lineHeight: 20,
            marginBottom: 40,
            marginTop: 20
          }} />



          <View style={{ position: 'absolute', bottom: 10, right: 10 }}>
            <PlainButton title={"Okay !"} onPress={() => {
              setShowSuccessAlert(!showSuccessAlert)

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


        <View style={{ padding: 15, marginTop: 10 }}>
          <StyleTextView value={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.PRIMARY_ACCOUNT)} style={{
            fontSize: fontSize.textLarge,
            fontFamily: fontName.medium,
            color: theme.colors.headingTextColor,
            opacity: .8,

          }} />



          <FlatList
            data={accDetails}
            extraData={accDetails}
            numColumns={1}
            style={{ width: '100%', height: 'auto', marginBottom: 50, maxHeight: 200, paddingRight: 10 }}
            key={({ index }) => index.toString()}
            renderItem={({ item, index }) => {
              return (
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      const dummyData = accDetails
                      let arr = dummyData.map((items, ind) => {
                        if (ind == index) {
                          items.isSelected = true
                          // setSelectedAcc(items.acctNo)
                        }
                        else {
                          items.isSelected = false
                        }
                        return { ...items }
                      })
                      setAccDetails(arr)
                      setAccFilterList(arr)
                    }}

                    style={{ flexDirection: 'row', width: '100%', alignItems: 'center', paddingTop: 10, paddingBottom: 10 }}>

                    <View style={{ width: '90%' }}>

                      <StyleTextView value={item.acctShortName !== null ? item.acctShortName : item.acctName} style={{
                        fontSize: fontSize.textNormal,
                        fontFamily: fontName.regular,
                        color: theme.colors.black,
                        textAlign: 'left',
                        paddingTop: 5,
                        opacity: .8,
                      }} />
                      <StyleTextView value={item.acctNo} style={{
                        fontSize: fontSize.textNormal,
                        fontFamily: fontName.regular,
                        color: theme.colors.grey,
                        textAlign: 'left',
                        paddingTop: 5
                      }} />
                      <StyleTextView value={item.acctBranchDesc} style={{
                        fontSize: fontSize.textNormal,
                        fontFamily: fontName.regular,
                        color: theme.colors.grey,
                        textAlign: 'left',
                        paddingTop: 5
                      }} />

                    </View>


                    <View style={{ width: '10%', alignSelf: 'flex-end' }}>
                      {item.isSelected ? <TickIcon /> :
                        null
                      }
                    </View>


                  </TouchableOpacity>

                  {index + 1 < accDetails.length
                    ?
                    <View style={{
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      borderColor: theme.colors.dividerColor,
                      opacity: .2
                    }} />
                    :
                    null}
                </View>
              )
            }}

          />


          {accDetails.length > 0 ?

            <View style={{ position: 'absolute', bottom: 10, right: 10, flexDirection: 'row' }}>
              <PlainButton
                style={{ marginRight: 20, color: theme.colors.grey, fontFamily: fontName.medium, fontSize: fontSize.textLarge, }}
                title={t(AUTH_KEYS.LOCATE_US.CANCEL)} onPress={() => {
                  const dummyData = accDetails
                  let arr = dummyData.map((items, ind) => {
                    if (items.primaryAccount === true) {
                      items.isSelected = true
                      // setSelectedAcc(items.acctNo)
                    }
                    else {
                      items.isSelected = false
                    }
                    return { ...items }
                  })
                  setAccDetails(arr)
                  setShowConfirmAlert(!showConfirmAlert)
                }
                } />

              <PlainButton title={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.SET_AS_PRIMARY)}
                style={{ fontFamily: fontName.medium, fontSize: fontSize.textLarge, }}
                onPress={() => {
                  setShowConfirmAlert(!showConfirmAlert)
                  setPrimaryAccountCall()
                }
                } />
            </View>
            :
            null}


        </View>
      </Overlay>
    );
  }

  return (

    <View style={{
      flex: 1,
      backgroundColor: theme.colors.white,
    }}>

      <AuthHeader title={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.SET_PRIMARY_ACCOUNT)}
        navigation={navigation}
      />

      {successAlertUI()}
      {confirmAlertUI()}

      <ScrollView>
        <View style={{
          alignItems: 'center',
          marginTop: 20,
          marginLeft: 30,
          marginRight: 30,
        }}>


          <StyleTextView value={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.PLEASE_SELECT_BANK)} style={{
            ...FONTS.h1,
            fontFamily: fontName.medium,
            color: theme.colors.textColor,
            textAlign: 'center',
            lineHeight: 25,
            marginTop: '8%',
            marginBottom: 20
          }} />
          <StyleTextView value={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.SET_PRIMARY_ACCOUNT_DESCRIPTION)} style={{
            fontSize: fontSize.textNormal,
            fontFamily: fontName.regular,
            color: theme.colors.headingTextColor,
            opacity: .8,
            lineHeight: 20,
            margin: 10
          }} />

        </View>

        <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>

          <TouchableOpacity
            // style={{ flex: 1, position: 'absolute', right: 0, bottom: 10, flexDirection: 'column' }}

            onPress={() => {
              setShowConfirmAlert(true)
            }} >
            <StyleInputView
              placeholder={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.PRIMARY_ACCOUNT)}
              value={selectedAcc}
              // defaultValue={'acctNo'}
              onPress={() => { }}
              editable={false}
              onChangeText={(text) => {

              }}
            />
            <View style={{ flex: 1, position: 'absolute', right: 0, bottom: 10, flexDirection: 'column' }}>
              <SelectDownArrowIcon />
            </View>

          </TouchableOpacity>
        </View>
      </ScrollView>


      {isLoading && <LoaderComponent />}
    </View>

  );
}



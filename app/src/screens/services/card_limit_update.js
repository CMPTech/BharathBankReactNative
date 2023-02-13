import React, { useEffect, useContext, useState, useCallback } from "react";
import {
  View,
  Image,
  StyleSheet,
  ScrollView
} from "react-native";
import { fontName, fontSize } from "../../../styles/global.config";
import { AppContext } from "../../../themes/AppContextProvider";
import { AuthHeader, BCBDropDownView, LoaderComponent, MainButton } from "../../components";
import StyleTextView from "../../components/input/StyleTextView";
import { Switch } from 'react-native-switch';
import PlainButton from "../../components/button/PlainButton";
import { Overlay } from 'react-native-elements'
import Slider from "react-native-slider";
import { currencyFormat } from "../../utils/amount-util";
import BCBSourceAccountDropDown from "../../components/dropdown/BCBSourceAccountDropDown";
import Home from "../../api/dashboard";
import { showMessage, hideMessage } from "react-native-flash-message";
import { useSelector } from "react-redux";
import { profileSelector } from "../../store/selectors";

export default function DebitCardLimitScreen({ navigation, route }) {

  const { theme, changeTheme } = useContext(AppContext)

  const [selectedAccValue, setSelectedAccValue] = useState('');
  const [isValueChanged, setValueChanged] = useState(true);

  const [showSuccessAlert, setShowSuccessAlert] = useState(false)

  const [showConfirmAlert, setShowConfirmAlert] = useState(false)


  const profileData = useSelector(profileSelector)

  //const profileData = route.params.profileData
  const [atmLimit, setATMLimit] = useState(1);
  const [inStoreLimit, setInStoreLimit] = useState(1);
  const [onlineLimit, setOnlineLimit] = useState(1);
  const [atmMinLimit, setATMMinLimit] = useState(1);
  const [atmMaxLimit, setIATMaxLimit] = useState(500000);
  const [inStoreMinLimit, setInStoreMinLimit] = useState(1);
  const [inStoreMaxLimit, setInStoreMaxLimit] = useState(500000);
  const [onlineMinLimit, setOnlineMinLimit] = useState(1);
  const [onlineMaxLimit, setOnlineMaxLimit] = useState(1000000);
  const [isLoading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState([])
  const [successResponseData, setSuccessResponseData] = useState([])
  useEffect(() => {
  }, []);
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
          <StyleTextView value={"Transaction limits updated"} style={{
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

          <StyleTextView value={"Would you like to save the revised transaction limits?"} style={{
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

            <PlainButton title={"Save"}
              style={{ fontFamily: fontName.medium }}
              onPress={() => {
                setShowConfirmAlert(!showConfirmAlert)
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

      <AuthHeader title={'Debit Card limits'}
        navigation={navigation}
      />

      {successAlertUI()}
      {confirmAlertUI()}

      <ScrollView>
        <View style={{
          //alignItems: 'center',
          margin: 20,
        }}>



          <StyleTextView value={"Auto-disable automatically disable the card within 15mins of swipe. This improves security, as no tran"} style={{
            fontSize: fontSize.textSmall,
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


          <StyleTextView value={"ATM withdrawal limit"} style={{
            fontSize: fontSize.textNormal,
            fontFamily: fontName.medium,
            color: theme.colors.grey,
            lineHeight: 20,
            marginTop: 20,
            marginHorizontal: 10
          }} />

          <StyleTextView value={currencyFormat(atmLimit, "INR")} style={{
            fontSize: fontSize.textNormal,
            fontFamily: fontName.medium,
            color: theme.colors.headingTextColor,
            opacity: .8,
            lineHeight: 20,
            marginTop: 5,
            marginHorizontal: 10
          }} />
          <Slider
            minimumValue={atmMinLimit}
            maximumValue={atmMaxLimit}
            step={10000}
            style={{ marginHorizontal: 10 }}
            minimumTrackTintColor={theme.colors.buttonStrokeStartColor}
            maximumTrackTintColor='#d3d3d3'
            thumbTintColor={theme.colors.buttonColor}
            value={atmLimit}
            onValueChange={(value) => {
              setValueChanged(false)
              setATMLimit(value)
            }
            }
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10 }}>
            <StyleTextView value={currencyFormat(atmMinLimit)} style={{
              fontSize: fontSize.textNormal,
              fontFamily: fontName.regular,
              color: theme.colors.headingTextColor,
              opacity: .8,
              lineHeight: 20,
            }} />

            <StyleTextView value={currencyFormat(atmMaxLimit)} style={{
              fontSize: fontSize.textNormal,
              fontFamily: fontName.regular,
              color: theme.colors.headingTextColor,
              opacity: .8,
              lineHeight: 20,
            }} />
          </View>
          <StyleTextView value={"In-store transaction limit"} style={{
            fontSize: fontSize.textNormal,
            fontFamily: fontName.medium,
            color: theme.colors.grey,
            lineHeight: 20,
            marginTop: 20,
            marginHorizontal: 10
          }} />

          <StyleTextView value={currencyFormat(inStoreLimit, "INR")} style={{
            fontSize: fontSize.textNormal,
            fontFamily: fontName.medium,
            color: theme.colors.headingTextColor,
            opacity: .8,
            lineHeight: 20,
            marginTop: 5,
            marginHorizontal: 10
          }} />
          <Slider
            minimumValue={inStoreMinLimit}
            maximumValue={inStoreMaxLimit}
            step={10000}
            style={{ marginHorizontal: 10 }}
            minimumTrackTintColor={theme.colors.buttonStrokeStartColor}
            maximumTrackTintColor='#d3d3d3'
            thumbTintColor={theme.colors.buttonColor}
            value={inStoreLimit}
            onValueChange={(value) => {
              setValueChanged(false)
              setInStoreLimit(value)
            }
            }
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10 }}>
            <StyleTextView value={currencyFormat(inStoreMinLimit)} style={{
              fontSize: fontSize.textNormal,
              fontFamily: fontName.regular,
              color: theme.colors.headingTextColor,
              opacity: .8,
              lineHeight: 20,
            }} />

            <StyleTextView value={currencyFormat(inStoreMaxLimit)} style={{
              fontSize: fontSize.textNormal,
              fontFamily: fontName.regular,
              color: theme.colors.headingTextColor,
              opacity: .8,
              lineHeight: 20,
            }} />
          </View>


          <StyleTextView value={"Online transaction limit"} style={{
            fontSize: fontSize.textNormal,
            fontFamily: fontName.medium,
            color: theme.colors.grey,
            lineHeight: 20,
            marginTop: 20,
            marginHorizontal: 10
          }} />

          <StyleTextView value={currencyFormat(onlineLimit, "INR")} style={{
            fontSize: fontSize.textNormal,
            fontFamily: fontName.medium,
            color: theme.colors.headingTextColor,
            opacity: .8,
            lineHeight: 20,
            marginTop: 5,
            marginHorizontal: 10
          }} />
          <Slider
            minimumValue={onlineMinLimit}
            maximumValue={onlineMaxLimit}
            step={10000}
            style={{ marginHorizontal: 10 }}
            minimumTrackTintColor={theme.colors.buttonStrokeStartColor}
            maximumTrackTintColor='#d3d3d3'
            thumbTintColor={theme.colors.buttonColor}
            value={onlineLimit}
            onValueChange={(value) => {
              setValueChanged(false)
              setOnlineLimit(value)
            }
            }
          />
        </View>
      </ScrollView>

      <MainButton
        noBorder={true}
        disabled={selectedAccValue.length === 0 ? true : isValueChanged}
        btnContainerStyle={{ width: '100%' }} title={"Save"} onPress={() => {

          setShowConfirmAlert(true)
        }} />

      {isLoading && <LoaderComponent />}
    </View>

  );
}
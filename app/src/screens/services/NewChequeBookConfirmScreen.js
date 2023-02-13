import React, { useEffect, useContext, useState, useCallback } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Keyboard,
  TextInput
} from "react-native";
import { fontName, FONTS, colors, SIZES, fontSize } from "../../../styles/global.config";
import { AppContext } from "../../../themes/AppContextProvider";
import { AcceptTermsIcon, RadioButtonUncheckedIcon } from "../../../assets/svg";
import { AuthHeader, LoaderComponent, MainButton } from "../../components";
import StyleTextView from "../../components/input/StyleTextView";
import { SERVICES } from "../../routes";
import { BottomButton, } from '../../components';
import Services from '../../api/Services'
import { showMessage } from "react-native-flash-message";
import { useTranslation } from 'react-i18next';
import { AUTH_KEYS } from '../../../assets/translations/constants';
export default function NewChequeBookScreenConfirm({ navigation, route }) {
  const { t, i18n } = useTranslation();
  const { params } = route;
  const { theme, changeTheme } = useContext(AppContext)
  const [isLoading, setLoading] = useState(false);
  const [address, setAddress] = useState(params.customerAddres)
  const [errors, setError] = useState('')
  const [isFocused, setIsFocused] = useState(false);
  const [selectAddress, setAddressList] = useState([{
    label: t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.REGISTERD_ADDRESS),
    value: "REGISTERED",
    isSelected: true,

  }, {
    label: t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.HOME_BRANCH),
    value: "HOME",
    isSelected: false,

  }, {
    label: t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.CUSTOM_ADDRESS),
    value: 'CUSTOM',
    isSelected: false,
  }])
  const nextButton = useCallback(async () => {
    if (address.length > 0) {

      setError("")
      try {
        const typeOfAddress = selectAddress.find(v => v.isSelected === true).value
        const dynamicName = params.dynamicName
        let request = {
          "srcAccount": params.acctNo,
          "noOfLeaves": params.noOfLeaves,
          "personaliseChequeBook": params.personalise,
          "address": address,
          "name": params.nameOfCompany,
          "remarks": "",
          "brnCode": params.acctBranchID,
          "remarks": params.remarks,
          "secondName": dynamicName[1] === undefined ? "" : dynamicName[1].value,
          "thirdName": dynamicName[2] === undefined ? "" : dynamicName[2].value,
          "companySignature": params.authSignatory,
          "designation": params.designation,
          "accountPayee": params.accountPrint,
          "typeOfAddress": typeOfAddress,
          accountNo: params.acctNo,
        };
        setLoading(true);
        const response = await Services.getChequeBookVerifyApi(request);
        setLoading(false);
        if (response.otpEnable) {
          navigation.navigate(SERVICES.CHEQUE_BOOK_REQUEST_OTP, { requestData: { ...request, accountNo: params.acctNo, } })
        }
        else {
          confirmationCallApi();
        }

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
    }
    else {
      setError("Please enter address")
    }
  },
    [navigation, address,params,selectAddress])
  const confirmationCallApi = useCallback(async () => {
    try {
      let request = {
        "srcAccount": params.acctNo,
        "noOfLeaves": params.noOfLeaves,
        "personaliseChequeBook": params.personalise,
        "address": address,
        "name": params.nameOfCompany,
        "remarks": "",
        "brnCode": params.acctBranchID,
        "remarks": params.remarks,
        "secondName": dynamicName[1] === undefined ? "" : dynamicName[1].value,
        "thirdName": dynamicName[2] === undefined ? "" : dynamicName[2].value,
        "companySignature": params.authSignatory,
        "designation": params.designation,
        "accountPayee": true,
        "typeOfAddress": typeOfAddress,
        accountNo: params.acctNo,
        "otp": "123456",

      };
      setLoading(true);
      const response = await Services.getChequeBookConfirmApi(request);
      navigation.navigate(SERVICES.NEW_CHEQUE_BOOK_SUCCESS_SCREEN, response)
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
    [navigation, address,params,selectAddress])
  const renderItem = ({ item, index }) => {

    return (
      <TouchableOpacity
        style={{}}
        onPress={() => {
          console.log(params.custBrDesc)
          setAddress(index === 0 ? params.customerAddres : index === 1 ? params.custBrDesc : "")
          setIsFocused(false)
          const dummyarray = selectAddress;
          let arr = dummyarray.map((item, ind) => {
            if (index === ind) {
              item.isSelected = true
            }
            else {
              item.isSelected = false
            }

            return { ...item }
          })
          setAddressList(arr)
        }}
      >
        <View style={{ flexDirection: 'row', }}>
          {item.isSelected ? <AcceptTermsIcon /> : <RadioButtonUncheckedIcon />}
          <StyleTextView style={{ fontFamily: fontName.medium, fontSize: fontSize.textLarge, color: theme.colors.textColor, marginLeft: 10, marginBottom: 15 }}
            value={item.label}
          />

        </View>
        {item.isSelected && index !== 1 && <View>
          <TextInput
            style={[{
              borderRadius: 0,
              marginTop: 3,
              marginLeft: 0,
              fontFamily: fontName.semi_bold,
              fontSize: fontSize.textLarge,
              flex: 1,
              fontFamily: fontName.medium,
              padding: 0,
              marginLeft: 30,
              width: SIZES.width * 0.8,
              marginRight: 30,
              marginBottom: 10,
              color: theme.colors.textColor,
              borderBottomColor: isFocused ? theme.colors.buttonColor : theme.colors.grey,
              borderBottomWidth: 0.6,
            }]}
            multiline={true}
            value={address}
            returnKeyType="done"
            blurOnSubmit={true}
            onSubmitEditing={() => { Keyboard.dismiss() }}
            editable={index !== 0}
            onFocus={() => {
              setIsFocused(true)
            }}
            onBlur={() => {
              setIsFocused(false)
            }}
            onChangeText={(text) => {
              setAddress(text)
            }}
          />
          {errors ? (
            <StyleTextView value={errors} style={{
              color: theme.colors.red,
              fontSize: fontSize.textSmall,
              marginTop: 5,
              marginLeft: 30,
              fontFamily: fontName.regular
            }} />
          ) : null
          }
        </View>
        }

      </TouchableOpacity>)
  }
  return (

    <View style={{
      flex: 1,
      backgroundColor: theme.colors.white,
    }}>

      <AuthHeader title={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.NEW_CHEQUE_BOOK)}
        navigation={navigation}
      />

      <View style={{
        alignItems: 'center',
        marginTop: 20,
        marginLeft: 30,
        marginRight: 30,
      }}>
        <StyleTextView value={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.CHEQUE_BOOK_CONFIRM_DESC)} style={{
          fontFamily: fontName.medium,
          color: theme.colors.headingTextColor,
          fontSize: fontSize.textLarge,
          textAlign: 'center',
          lineHeight: 25,
          marginTop: '10%',
          marginBottom: 5
        }} />
      </View>
      <StyleTextView value={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.DELIVER_TO)} style={{
        fontSize: fontSize.textLarge,
        fontFamily: fontName.medium,
        color: theme.colors.textColor,
        textAlign: 'left',

        marginLeft: 15
      }} />
      <View style={{ marginTop: 5, marginLeft: 10, marginTop: 20 }} >
        <FlatList
          data={selectAddress}
          extraData={selectAddress}
          keyExtractor={(item, index) => `${index}`}
          renderItem={renderItem}
          ListEmptyComponent={() => {
            return (<View></View>)
          }}

        />
      </View>
      {isLoading && <LoaderComponent />}
      <MainButton

        title={t(AUTH_KEYS.CUSTOM_DRAWER_SCREEN.ORDER_NOW)}
        onPress={nextButton}
        noBorder
        btnContainerStyle={{ width: SIZES.width, position: 'absolute', bottom: 0 }}
      />
    </View>

  );
}



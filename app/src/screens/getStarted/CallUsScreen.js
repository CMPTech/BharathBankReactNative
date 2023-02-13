import React, { useEffect, useContext, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  Linking,
  ScrollView,
  StyleSheet,
  FlatList
} from "react-native";
import { fontName, fontSize, FONTS, SIZES } from "../../../styles/global.config";
import LinearGradient from 'react-native-linear-gradient';
import { AppContext } from "../../../themes/AppContextProvider";
import { useTranslation } from 'react-i18next';
import { AUTH_KEYS } from '../../../assets/translations/constants';
import { AuthHeader, MainButton } from '../../components';
import { FAQS, LOCATION } from '../../routes'
import Geolocation from 'react-native-geolocation-service';
import StyleTextView from "../../components/input/StyleTextView";
import { GetStartedCallIcon, GetStartedCallusIcon, GetStartedFAQIcon, NeedAssistanceIcon } from "../../../assets/svg";
import MailboxIcon from "../../../assets/svg/mailbox.icon";
import { useSelector } from "react-redux";
import { metaDataSelector } from "../../store/selectors";
import PlainButton from "../../components/button/PlainButton";

export default function CallUsScreen({ navigation, route }) {

  const { t, i18n } = useTranslation();
  const { theme, changeTheme } = useContext(AppContext)

  //const callUsData = route.params.callUsData

  const callUsData = useSelector(metaDataSelector)

  const [responseData, setResponseData] = useState([])



  useEffect(() => {
    setResponseData(callUsData.contactUs)
  }, []);


  const onPressMobileNumberClick = (number) => {

    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${number}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }

    Linking.openURL(phoneNumber);
  }

  function renderDetails() {

    return responseData.map((item) => {
      return (
        <View style={{
          flexDirection: 'column',
          // paddingLeft: 10,
          // marginLeft: 10,
          marginTop: 15,
        }}>
          <View>
            <StyleTextView value={item.lable}
              style={{
                fontSize: fontSize.textNormal,
                fontFamily: fontName.medium,
                color: theme.colors.black,
                opacity: 0.7,
                marginTop: 15,
                paddingLeft: 15,
              }} />
          </View>
          {/* <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}> */}
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 15, overflow: 'scroll', paddingLeft: 15, }}>

            <FlatList
              data={item.mobileNo}
              numColumns={2}
              keyExtractor={(item, index) => `${index}`}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity
                    onPress={() => { onPressMobileNumberClick(item) }} >
                    <View style={{ flexDirection: 'row', 
                     alignContent:'center',
                     alignItems:'center',
                     marginTop:Platform.OS==='android'? 5:10,
                     }}>
                      <GetStartedCallusIcon color1={theme.colors.buttonColor} />
                      <StyleTextView value={item}
                        style={{
                          fontSize: fontSize.textNormal,
                          fontFamily: fontName.regular,
                          color: theme.colors.grey,
                          paddingVertical: 3,
                          marginRight: 20,
                          marginLeft: 10,
                        }} />
                    </View>
                  </TouchableOpacity>
                )
              }
              }

            />

            {/* {item.mobileNo.map((mob) => {
                return (
                  <TouchableOpacity
                    onPress={() => { onPressMobileNumberClick(mob) }} >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <GetStartedCallIcon color1={theme.colors.buttonColor} />
                      <StyleTextView value={mob}
                        style={{
                          fontSize: fontSize.textNormal,
                          fontFamily: fontName.regular,
                          color:theme.colors.grey
                        }} />
                    </View>
                  </TouchableOpacity>
                );
              })
              } */}
          </View>
          {/* </ScrollView> */}

          {item.email != null &&
            <TouchableOpacity
              onPress={() => Linking.openURL(`mailto:${item.email}`)}
              title="BCB">
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 15,marginTop:10 }}>
                <MailboxIcon color1={theme.colors.buttonColor} />
                <StyleTextView value={item.email}
                  style={{
                    fontSize: fontSize.textNormal,
                    fontFamily: fontName.medium,
                    color: theme.colors.buttonColor,
                    padding: 5,
                    marginLeft: 5,
                  }} />
              </View>
            </TouchableOpacity>
          }

          <View style={{
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderColor: theme.colors.dividerColor,
            opacity: .2,
            paddingTop: 10,
            marginTop: 15
          }} />
        </View>
      );
    });
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.bgColor
      }}>

      <AuthHeader title={t(AUTH_KEYS.CALL_US.TITLE_HELP)}
        navigation={navigation} />





      <TouchableOpacity
      style={{marginTop:30}}
        onPress={() =>
          navigation.navigate(FAQS)
        }>
        <View style={{
          backgroundColor: 'white',
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
          margin: 15,
          borderRadius: 5,
          paddingHorizontal:20,
          paddingVertical:30,
          flexDirection: 'row',
          alignContent:'center',
          alignItems:'center'
          
        }}>
          <NeedAssistanceIcon color1={theme.colors.buttonColor} />
          <View style={{marginLeft:15}}>
            <StyleTextView value={"Need some assistance?"}
              style={{
                fontSize: fontSize.header3,
                fontFamily: fontName.medium,
                color: theme.colors.grey,
                marginLeft: 10
              }} />
            <StyleTextView value={"Refer to our FAQs"}
              style={{
                fontSize: fontSize.textNormal,
                fontFamily: fontName.regular,
                color: theme.colors.grey,
                marginLeft: 10,
                marginTop:Platform.OS==='android'?0:10
              }} />
          </View>
        </View>


      </TouchableOpacity>

      <View style={{
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        paddingBottom: 10
      }}>
        <StyleTextView value={"or"}
          style={{
            fontSize: fontSize.textSmall,
            fontFamily: fontName.regular,
            color: theme.colors.grey,
            textAign: 'center',

          }} />
      </View>


      <View style={{
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: theme.colors.dividerColor,
        opacity: .2,
      }} />

      <ScrollView>




        {responseData != null && renderDetails()}
      </ScrollView>



    </SafeAreaView>
  );
}



import React, { useEffect, useContext, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Platform,
  Animated,
  Alert, BackHandler, ToastAndroid
} from "react-native";
import { fontName, fontPixel, FONTS, fontSize, pixelSizeVertical, SIZES } from "../../../styles/global.config";
import LinearGradient from 'react-native-linear-gradient';
import { AppContext } from "../../../themes/AppContextProvider";
import TitleText from "../../components/base/TitleText";
import MainButton from "../../components/button/MainButton";
import { CloseIcon, GetStartedCallIcon, GetStartedCallusIcon, GetStartedFAQIcon, GetStartedLocationIcon, ImportantNoticeIcon, SelectUpArrowIcon } from "../../../assets/svg";
import Carousel from 'react-native-snap-carousel';
import { REGISTER, LOCATION, CALL_US, AUTH, FAQS, HOME, PAY_PEOPLE, PRIVACY_POLICY } from "../../routes";
import { useTranslation } from 'react-i18next';
import { AUTH_KEYS } from '../../../assets/translations/constants';
import LanguageSelectComponent from '../../components/base/language_select';
import Auth from "../../api/auth";
import Toast from "react-native-toast-message";
import PlainButton from "../../components/button/PlainButton";
import { showMessage, hideMessage } from "react-native-flash-message";
import AuthBody from "../../components/base/AuthBody";
import { useSelector } from "react-redux";
import { mobileNumberSelector, randomKeySelector } from "../../store/selectors";
import { LoaderComponent } from "../../components";
import { Overlay } from 'react-native-elements';
import StyleTextView from '../../components/input/StyleTextView';
import { useIsFocused } from "@react-navigation/native";

import { NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { PermissionsAndroid } from 'react-native';
// import WifiManager from 'react-native-wifi-reborn';
import WifiManager from "react-native-wifi-reborn";




export default function GetStartedScreen({ navigation, route }) {
  const { t, i18n } = useTranslation();
  const { theme, changeTheme } = useContext(AppContext)
  const [isVisible, setIsVisible] = useState(false)
  const isFocused = useIsFocused();
  const [showLoginBtn, setShowLoginBtn] = useState(false);
  const [assistanceMsg, setAssistanceMsg] = useState('')
  const [showRegisterBtn, setShowRegisterBtn] = useState(false)
  const [showConfirmAlert, setShowConfirmAlert] = useState(false)
  const mobileNumberInApp = useSelector(mobileNumberSelector)
  const rendomKeyInApp = useSelector(randomKeySelector)

  const { height } = Dimensions.get('window');

  const [responseData, setResponseData] = useState([])
  const { width: screenWidth } = Dimensions.get('window');
  const IS_ANDROID = Platform.OS === 'android';
  const SLIDER_1_FIRST_ITEM = 0;

  const [isLoading, setLoading] = useState(false);

  const renderItem = ({ item, index }) => {
    return (
      <View style={{ alignItems: 'center', marginTop: 10 }}>
        <Image source={item} />
      </View>
    );
  }

  state = {
    fadeValue: new Animated.Value(0)
  };

  _start = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(this.state.fadeValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true
        }),
        Animated.timing(this.state.fadeValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true
        })
      ]),
      // {
      //   iterations: 4
      // }
    ).start()
  };


  



  useEffect(() => {
    ran()
    requestLocationPermission()
    
    if (isFocused) {
      getMetaData()
      const backAction = () => {
        setShowConfirmAlert(true);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove()
    }

  }, [isFocused]);

  const ran = async () => {
    console.log("ran func invoke ");
    const MyModule = await NativeModules.MyModule;
    console.log("MyModule ", MyModule);

    await MyModule.myMethod('Raghu', 2, (result) => {
      console.log("MyModule.myMethod  invoke ");
      console.log("res", result);
    });


    const myString = await AsyncStorage.getItem('RandomKeyForReactNative');
    console.log("myString",myString); // outputs "Hello from Android!"
    setRandomKey(myString)
    
  }


  const showToast = (error) => {
    ToastAndroid.show(error, ToastAndroid.LONG);
  };

  async function requestLocationPermission() {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission granted');
          getWifiData()
        } else {
          console.log('Location permission denied');
        }
      } catch (err) {
        console.log("error in location fn" +err);
      }
    } else {
      // For iOS, location permission is granted by default and cannot be requested
      console.log('Location permission granted');
    }
  }

  const getWifiData = async () => {
    console.log("requestLocationPermission invoke");
    try{
      WifiManager.getCurrentWifiSSID()
      .then(ssid => {
        console.log('Your current connected wifi SSID is  ' + ssid);
        getWifiList(ssid);
      })
      .catch(err => {
        showToast(JSON.stringify("SSID "+err.message));
        console.log('Cannot get current SSID!' + err);
      });
    }catch(err){
      console.log("error in getwifi" +err);
    }
  };
  
  const getWifiList = (ssid) => {
    WifiManager.loadWifiList()
      .then(ssidList => {
        console.log('Your current list wifi SSID is ' + JSON.stringify(ssidList));
        const obj = ssidList.find(item => item.SSID === ssid);
        console.log("obj " +JSON.stringify(obj));
        console.log("network obj" +obj.SSID);
        console.log("network obj" +obj.capabilities);
        let security = obj.capabilities;
        if(obj !== null  || obj !== undefined){
          if(security !== null || security !== undefined){
            if(security.includes("WPA2") || security.includes("WPA")){
              showToast("It is a secured network");
            }
            else{
              showToast("It is not a secured network");
            }
          }
          else showToast("Security type undefined");
        }
        else showToast("Wifi details not available");
        
      })
      .catch(err => {
        showToast(JSON.stringify("SSID "+err.message));
        console.log('Cannot get List SSID !' + err);
      });
  }



  


  const confirmAlertUI = () => {

    return (
      <Overlay
        isVisible={showConfirmAlert}
        onBackdropPress={() => setShowConfirmAlert(!showConfirmAlert)}
        height='auto'
        overlayStyle={{
          color: theme.colors.mainBackground1,
          width: '90%'
        }}>


        <View style={{ padding: 15 }}>
          <StyleTextView value={"Hold on!"} style={{
            fontSize: fontSize.textLarge,
            fontFamily: fontName.medium,
            color: theme.colors.textColor,
            marginTop: 10,
          }} />

          <StyleTextView value={"Do you want to exit the application ?"} style={{
            fontSize: fontSize.textNormal,
            fontFamily: fontName.regular,
            lineHeight: 20,
            color: theme.colors.textColor,
            paddingBottom: 20,
            marginTop: 30,
          }} />



          <View style={{ flexDirection: 'row', paddingTop: 20, alignSelf: 'flex-end', marginRight: 30 }}>
            <PlainButton
              style={{ marginRight: '30%', color: theme.colors.black, fontFamily: fontName.medium }}
              title={"Cancel"} onPress={() => {
                setShowConfirmAlert(!showConfirmAlert)
              }
              } />

            <PlainButton title={"Yes"}
              style={{ fontFamily: fontName.medium }}
              onPress={() => {
                setShowConfirmAlert(!showConfirmAlert)
                BackHandler.exitApp()
              }
              } />
          </View>


        </View>
      </Overlay>
    );
  }


  const getMetaData = useCallback(async () => {

    try {
      setLoading(true);
      const response = await Auth.getMetaDataApi();
      setResponseData(response)
      setLoading(false);
      getAppDatacheck()
    } catch (error) {
      setLoading(false);
      // getAppDatacheck()
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

  const getAppDatacheck = useCallback(async () => {
    try {
      let request = {
        userName: mobileNumberInApp || "",
        mobileNo: mobileNumberInApp || "",
        versionNo: "1.0",
        module: "REGISTRATION",
        randomKey: rendomKeyInApp,
      }
      setLoading(true);
      const response = await Auth.getAppDataCheckApi(request);
      setLoading(false);
      setShowRegisterBtn(response.registration)
      setShowLoginBtn(response.login)
      setAssistanceMsg(response.assistanceMsg)
      this._start()

    } catch (error) {
      setLoading(false);
      this._start()
      showMessage({
        message: "Error message",
        description: error.message || error.error,
        type: "danger",
        hideStatusBar: true,
        backgroundColor: "black", // background color
        color: "white", // text color
        hideOnPress: true,
        autoHide: false,
      });
    }
  },
    [navigation, assistanceMsg]
  );

  return (
    // <AuthBody
    //   title={"Register"}
    //   hideHeader={true}
    //   isLoading={isLoading}
    //   navigation={navigation}>
    <View style={{ flex: 1, }}>
      {confirmAlertUI()}
      <ImageBackground
        source={require('./../../../assets/images/bg_img.png')}
        style={{ width: "100%", height: "100%" }}
      >




        {/* <LanguageSelectComponent
            containerStyle={{ alignSelf: 'flex-end' }}
          /> */}
        <View style={{
          alignContent: 'center',
          alignItems: 'center',
          flex: 1,
          //padding: 20,
          marginTop: '20%'
        }}>

          <TitleText title={t(AUTH_KEYS.WEL_COME.WEL_COME_MESSAGE)}
            style={{
              fontSize: fontPixel(35),
              color: theme.colors.white,
              fontFamily: fontName.light,
              textAlign: 'center',
              marginBottom: pixelSizeVertical(10)
            }} />

          {/* <LanguageSelectComponent containerStyle={{ position: 'absolute', top: 0, right: 10 }} /> */}


          {showRegisterBtn &&
            <MainButton
              btnContainerStyle={{ paddingLeft: 10, paddingRight: 10, }}
              title={t(AUTH_KEYS.WEL_COME.REGISTER)}
              onPress={() => { navigation.navigate(REGISTER.REGISTER_OPTION, { forgotmPIN: false, assistanceMsg }) }}
            />
          }
          {showLoginBtn &&
            <MainButton btnContainerStyle={{ paddingLeft: 10, paddingRight: 10, }}
              title={t(AUTH_KEYS.WEL_COME.LOGIN)} onPress={() => { navigation.navigate(AUTH.M_PIN_LOGIN, { assistanceMsg }) }} />
          }


          <View style={{ flex: 1, position: 'absolute', bottom: '5%', width: '100%' }}>

            <View style={{ flex: 1, marginHorizontal: 10, flexDirection: 'row', justifyContent: 'space-around', padding: 20 }}>
              <TouchableOpacity style={{ flexDirection: 'column', alignItems: 'center' }}
                onPress={() => {
                  navigation.navigate(CALL_US)
                }}>
                <GetStartedCallIcon />
                <TitleText title={t(AUTH_KEYS.WEL_COME.CALL_US)}
                  style={{
                    fontSize: fontSize.textNormal,
                    fontFamily: fontName.regular,
                    marginTop: 10,
                    color: theme.colors.lightGreen
                  }} />
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'column', alignItems: 'center' }}
                onPress={() => {
                  navigation.navigate(LOCATION.ACCESS_LOCATION)
                }}
              >

                <GetStartedLocationIcon />
                <TitleText title={t(AUTH_KEYS.WEL_COME.LOCATE_US)}
                  style={{
                    fontSize: fontSize.textNormal,
                    fontFamily: fontName.regular,
                    marginTop: 10,
                    color: theme.colors.lightGreen
                  }} />
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'column', alignItems: 'center' }}
                onPress={() => {
                  navigation.navigate(FAQS)
                }}
              >

                <GetStartedFAQIcon />
                <TitleText title={t(AUTH_KEYS.WEL_COME.FAQ)}
                  style={{
                    fontSize: fontSize.textNormal,
                    fontFamily: fontName.regular,
                    marginTop: 10,
                    color: theme.colors.lightGreen
                  }} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
            style={{ flex: 1, marginLeft: 10,}}
              onPress={() => {
                navigation.navigate(PRIVACY_POLICY)
              }}>
              <TitleText title={t(AUTH_KEYS.REGISTER.PRIVACY_POLICY)}
                style={{
                  fontSize: fontSize.textSmall,
                  fontFamily: fontName.regular,
                  color: theme.colors.lightGreen,
                }} />
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end', alignItems: 'center', marginTop: 10 }}>

              {
                responseData.importantNotice != null && responseData.importantNotice.length > 0 &&
                <View
                  style={{ width: '70%' }}
                 >
                  <View style={{
                    backgroundColor: theme.colors.lightYellowColor,
                    //opacity: this.state.fadeValue,
                    borderTopLeftRadius: 20,
                    borderBottomLeftRadius: 20,
                    width: '70%',
                    alignSelf: 'flex-end'
                  }}>
                    <TouchableOpacity
                  onPress={() => { setIsVisible(!isVisible) }}>

                  
                    <View
                      style={{
                        backgroundColor: theme.colors.yellowColor,
                        padding: 5,
                        marginLeft: 5,
                        marginTop: 5,
                        marginBottom: 5,
                        borderTopLeftRadius: 20,
                        borderBottomLeftRadius: 20,
                      }}>
                      <Text
                        style={{
                          fontSize: fontSize.textSmall,
                          fontFamily: fontName.regular,
                          color: '#001D5A',
                          textAlign: 'center',
                        }}>{t(AUTH_KEYS.WEL_COME.IMPORTENT_NOTICE)}</Text>

                    </View>
                    </TouchableOpacity>
                  </View>

                </View>
              }
            </View>

          </View>
        </View>






        {isVisible &&
          <View style={{
            flex: 1,
            height: '100%',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            backgroundColor: '#0008',
          }}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => { setIsVisible(!isVisible) }}

            >
              {/* <ImportantNoticeIcon /> */}
              <View style={{
                width: SIZES.width * .9,
                // position: 'absolute',
                alignItems: 'center',
                //flex: 1,
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                backgroundColor: 'white',
                borderRadius: 10
              }}>

                <View style={{ width: SIZES.width * .9, backgroundColor: theme.colors.yellowColor }}>
                  <Text
                    style={{
                      fontSize: fontSize.header2,
                      fontFamily: fontName.medium,
                      color: theme.colors.black,
                      textAlign: 'center',
                      padding: 10,
                      opacity: 0.7

                    }}>{t(AUTH_KEYS.WEL_COME.IMPORTENT_NOTICE)}</Text>
                </View>


                <Text
                  style={{
                    fontSize: fontSize.textNormal,
                    fontFamily: fontName.regular,
                    color: theme.colors.black,
                    marginTop: 20,
                    lineHeight: 20,
                    paddingBottom: 20,
                    opacity: 0.7
                  }}>{responseData.importantNotice}</Text>

                {/* <CloseIcon /> */}
                <Text
                  style={{
                    fontSize: fontSize.header2,
                    fontFamily: fontName.regular,
                    color: theme.colors.grey,
                    marginTop: 20,
                    lineHeight: 20,
                    paddingBottom: 20,
                    alignSelf: 'flex-end',
                    marginRight: 20
                  }}>{"Ok"}</Text>
              </View>


            </TouchableOpacity>
          </View>
        }



      </ImageBackground>

      {isLoading && <LoaderComponent />}
    </View>
    // </AuthBody>
  );
}



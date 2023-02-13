import React, { useEffect, useContext, useState, useCallback } from "react";
import {
    View,
    Text,
    Keyboard,
    TouchableOpacity,
    Alert,
    ImageBackground
} from "react-native";
import { fontName, FONTS, fontSize } from "../../../styles/global.config";
import { AppContext } from "../../../themes/AppContextProvider";
import AuthBody from "../../components/base/AuthBody";
import Box from "../../components/base/Box";
import { useTranslation } from 'react-i18next';
import StyleTextView from "../../components/input/StyleTextView";
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import { AUTH, HOME, REGISTER, SETTINGS } from "../../routes";
import { AUTH_KEYS } from '../../../assets/translations/constants';
import { ErrorMessagePopup, SelectProfilePopup } from '../../components'
import LinearGradient from 'react-native-linear-gradient';
import { BackIcon } from "../../../assets/svg";
import VirtualKeyboard from 'react-native-virtual-keyboard';
import Auth from "../../api/auth";
import { showMessage, hideMessage } from "react-native-flash-message";
import { biometricStatusSelector, mobileNumberSelector, mPinDataSelector } from "../../store/selectors";
import { getUniqueId } from 'react-native-device-info';
import { useSelector, useDispatch } from 'react-redux';
import { setProfileSelected, setUserDetails } from '../../store/actions/app.action';
import LoaderComponent from '../../components/base/LoaderComponent';
import TouchID from "react-native-touch-id";
import { imageBackground } from "../../../assets/images";
import SelectMPINPopup from '../../../src/components/Login/mpin_custom_component'
export default function PINLoginScreen({ navigation, route }) {
    const { assistanceMsg } = route.params;
    const dispatch = useDispatch();
    const { theme, changeTheme } = useContext(AppContext)
    const { t, i18n } = useTranslation();
    const [errorPopUp, setErrorPopUp] = useState({ show: false, message: '' });
    const [showProfilePopUp, setShowProfilePopUp] = useState(false);
    const [confirmOtpValue, setConfirmOtpValue] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [showMpinPopUp, setMpinPopUp] = useState(false);
    const [loginResponse, setLoginResponse] = useState([]);

    const mpinData = useSelector(mPinDataSelector)

    const checkBiometricStaus = useSelector(biometricStatusSelector)

    const [profileList, setProfileList] = useState([])

    // const login = useCallback(
    //     async () => {
    //         try {
    //             setShowProfilePopUp(true)
    //         } catch (error) {
    //             setErrorPopUp({ show: true, message: t(AUTH_KEYS.MPIN_LOGIN.SERVER_BUSY_ERROR) })
    //         }
    //     },
    //     [navigation, confirmOtpValue]
    // );

    const optionalConfigObject = {
        title: 'Touch ID', // Android
        imageColor: '#347AF0', // Android
        imageErrorColor: '#bcc6c7', // Android
        sensorDescription: 'Touch sensor', // Android
        sensorErrorDescription: 'Failed', // Android
        cancelText: 'Cancel', // Android
        fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
        unifiedErrors: false, // use unified error messages (default false)
        passcodeFallback: true, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
    };

    function authenticate() {
        return TouchID.authenticate('Place your finger on the fingerprint sensor to access the nexa.', optionalConfigObject)
            .then(biometryType => {
                setMpinPopUp(false);
                if (biometryType === 'FaceID') {
                    login(mpinData, true, "FINGERPRINT")
                } else {
                    login(mpinData, true, "FACEID")
                }

                
            })
            .catch(error => {
                // // Alert.alert(error.message || 'Authentication Failed');
                // showMessage({
                //     message: "Error message",
                //     description: error.message || 'Authentication Failed',
                //     type: "danger",
                //     hideStatusBar: true,
                //     backgroundColor: "black", // background color
                //     color: "white", // text color
                // });
            });
    }


    useEffect(() => {
        if (checkBiometricStaus) {
            TouchID.isSupported()
                .then(() => {
                    setMpinPopUp(true)
                    authenticate()
                })
                .catch(error => {
                    //Alert.alert('TouchID not supported');
                    showMessage({
                        message: "Error message",
                        description: "TouchID/Face ID not supported",
                        type: "danger",
                        hideStatusBar: true,
                        backgroundColor: "black", // background color
                        color: "white", // text color
                    });
                });
        }
    }, []);


    const login = useCallback(async (data, isEncrypted, type) => {

        try {
            let request = {
                "password": data,
                "userName": getUniqueId()._3,//mobileNumberInApp||"",
                version: "1.0",
                isEncrypted,
                "loginType": type,
            };
            setLoading(true);
            const response = await Auth.loginUser(request);
            setLoading(false);

            // let itemList = []
            // response.profileSelection.forEach((ele, index) => itemList.push({ ...ele, isSelected: index === 0 ? true : false }))
            // setProfileList(itemList)
            // if (itemList.length > 1) {
            //     setShowProfilePopUp(true)
            // } else {
            //     dispatch(setProfileSelected(itemList.find(v => v.isSelected === true)))
            //     navigation.navigate(HOME.CUSTOM_DRAWER, { profiledata: itemList })
            // }


            setLoginResponse(response)

            let itemList = []
            response.profileSelection.forEach((ele, index) => itemList.push({ ...ele, isSelected: index === 0 ? true : false }))

            setProfileList(itemList)

            if (itemList.length > 1) {
                setShowProfilePopUp(true)
            } else {
                getProfileDetails(itemList, response)
            }



        } catch (error) {
            setLoading(false);
            setConfirmOtpValue("")
            showMessage({
                message: "Error message",
                description: error.message || error.error,
                type: "danger",
                hideStatusBar: true,
                backgroundColor: "black", // background color
                color: "white", // text color,
                hideOnPress: true,
                autoHide: true,
                onPress: () => {
                    setConfirmOtpValue("")
                },
            });
        }
    },
        [navigation, profileList]
    );


    const getProfileDetails = useCallback(async (itemList, response) => {

        try {
            let request = {
                userId: itemList.find(v => v.isSelected === true).userId,
                profileId: itemList.find(v => v.isSelected === true).profileId,
            };
            setLoading(true);
            const profileResponse = await Auth.getProfileDetailsApi(request);
            setLoading(false);

            dispatch(setUserDetails(profileResponse.customerDetails))

            dispatch(setProfileSelected(itemList.find(v => v.isSelected === true)))





            if (loginResponse.securityQuestions) {
                navigation.navigate(SETTINGS.SECURITY_QUESTIONS, { profiledata: itemList, loginResponse: response })
            } else {
                navigation.navigate(HOME.CUSTOM_DRAWER, { profiledata: itemList, loginResponse: response })
            }



        } catch (error) {
            setLoading(false);
            // showMessage({
            //     message: "Error message",
            //     description: error.message || error.error,
            //     type: "danger",
            //     hideStatusBar: true,
            //     backgroundColor: "black", // background color
            //     color: "white", // text color
            // });

            showMessage({
                message: "Error message",
                description: error.message || error.error,
                type: "danger",
                hideStatusBar: true,
                backgroundColor: "black", // background color
                color: "white", // text color,
                hideOnPress: true,
                autoHide: true,
                onPress: () => {
                    setConfirmOtpValue("")
                },
            });
        }
    },
        [navigation, loginResponse]
    );

    return (
        <LinearGradient
            useAngle={true}
            style={{ flex: 1 }}
            angle={180}
            angleCenter={{ x: 0.5, y: 0.5 }}
            colors={["#4370e7", "#479ae8", "#4ad4e8"]} >

            <ImageBackground
                source={imageBackground}
                style={{ width: "100%", height: "100%" }}
            >

                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                    <View style={{
                        position: 'absolute',
                        left: 0,
                        alignContent: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignSelf: 'center',
                        zIndex: 1,

                    }}>
                        <TouchableOpacity
                            onPress={() => { navigation.goBack() }}>
                            <BackIcon />
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        textAlign: 'center',
                        alignContent: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignSelf: 'center',
                    }}>



                        <Text style={FONTS.headerText}>{t(AUTH_KEYS.MPIN_LOGIN.ENTER_MPIN)}</Text>



                    </View>
                </View>

                {/* <Text style={{
                color: theme.colors.headingSubTextColor,
                fontSize: fontSize.textLarge,
                fontFamily: fontName.regular,
                marginTop: 10,
                lineHeight: 24,
            }}>{t(AUTH_KEYS.REGISTER.CREATE_MPIN_SUBTITLE)}</Text> */}
                <View>
                    <Box>
                        <ErrorMessagePopup
                            showError={errorPopUp.show}
                            errorMessage={errorPopUp.message}
                            setErrorPopUp={setErrorPopUp}
                            onPress={() => {
                                setErrorPopUp({
                                    show: false,
                                    message: '',

                                })

                            }}
                        />
                        <SelectMPINPopup
                            showMpinPopUp={showMpinPopUp}
                            OnTouchIDPress={() => {
                                authenticate()
                                setMpinPopUp(false);
                            }}
                            EnterPINPress={() => {
                                setMpinPopUp(false);
                            }}
                            onPressCancel={() => {
                                setMpinPopUp(false);
                            }}
                        />
                        <SelectProfilePopup
                            showProfilePopUp={showProfilePopUp}
                            profileList={profileList}
                            setProfileList={setProfileList}
                            setShowProfilePopUp={setShowProfilePopUp}
                            errorMessage={errorPopUp.message}
                            setErrorPopUp={setErrorPopUp}
                            onPress={() => {
                                setShowProfilePopUp(false)
                                getProfileDetails(profileList, loginResponse)
                                // dispatch(setProfileSelected(profileList.find(v => v.isSelected === true)))
                                // navigation.navigate(HOME.CUSTOM_DRAWER, { profiledata: profileList })
                            }}
                        />
                        <View style={{
                            marginTop: '30%',
                            alignItems: 'center',
                            alignContent: 'center',
                        }}>

                            <SmoothPinCodeInput
                                placeholder={
                                    <View style={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: 10,
                                        opacity: 0.3,
                                        backgroundColor: theme.colors.lightGreen,
                                    }} />}
                                mask={
                                    <View style={{
                                        width: 15,
                                        height: 15,
                                        borderRadius: 15,
                                        backgroundColor: theme.colors.lightGreen,
                                    }} />}
                                cellSpacing={1}
                                codeLength={6}
                                maskDelay={10}
                                password={true}
                                cellStyle={null}
                                cellStyleFocused={null}
                                value={confirmOtpValue}
                                onTextChange={otpValue => {
                                    //setConfirmOtpValue(otpValue)
                                }
                                }
                            />
                        </View>

                        <TouchableOpacity onPress={() => {
                            navigation.navigate(REGISTER.REGISTER_OPTION, { forgotmPIN: true, assistanceMsg })
                        }}>
                            <StyleTextView value={t(AUTH_KEYS.MPIN_LOGIN.FORGOT_PIN)} style={{
                                fontSize: fontSize.textLarge,
                                fontFamily: fontName.medium,
                                color: theme.colors.lightGreen,
                                textAlign: 'center',
                                marginTop: 30
                            }} />
                        </TouchableOpacity>

                        <VirtualKeyboard
                            cellStyle={{ marginBottom: 10 }}
                            style={{ position: 'absolute', bottom: 10, width: '90%', marginBottom: '15%' }}
                            color='white'
                            clearOnLongPress={true}
                            pressMode='char'
                            onPress={(val) => {

                                let curText = confirmOtpValue;
                                if (isNaN(val)) {
                                    if (val === 'back') {
                                        curText = curText.slice(0, -1);
                                    } else if (val === 'clear') {
                                        curText = "";
                                    } else {
                                        curText += val;
                                    }
                                } else {
                                    curText += val;
                                }

                                setConfirmOtpValue(curText)
                                if (curText.length === 6) {
                                    login(curText, false, "MPINLOGIN");
                                }

                            }
                            } />

                        <View />
                    </Box>

                </View>
                {isLoading && <LoaderComponent />}
            </ImageBackground>
        </LinearGradient>
    );
}




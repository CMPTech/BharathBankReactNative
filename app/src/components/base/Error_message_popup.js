import React, { useContext, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
} from "react-native";
import { useTranslation } from 'react-i18next';
import { AUTH_KEYS } from "../../../assets/translations/constants";
import { Overlay } from 'react-native-elements';
import { fontName, fontSize } from "../../../styles/global.config";
import { AppContext } from "../../../themes/AppContextProvider";
import MainButton from "../../components/button/MainButton";
export default function ErrorMessagePopup({ showError, errorMessage, setErrorPopUp, onPress }) {

    const { theme, changeTheme } = useContext(AppContext)
    const { t, i18n } = useTranslation();
    return (
        <Overlay
            isVisible={showError}
            overlayStyle={{
                shadowColor: 'rgba(69,85,117,0.0)',
                backgroundColor: 'rgba(69,85,117,0.0)',
                borderWidth: 0,

            }}>
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                    setErrorPopUp({
                        show: false,
                        message: ''
                    })
                }}>

                <Image source={require('./../../../assets/images/pop_up_error.png')}>

                </Image>
                <View style={{
                    width: Platform.OS === 'android' ? '100%' : '90%',
                    position: 'absolute',
                    alignItems: 'center',
                    paddingLeft: 20,
                    paddingRight: 10,
                    flex: 1,
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                }}>

                    <Text
                        style={{
                            fontSize: fontSize.textLarge,
                            fontFamily: fontName.bold,
                            color: theme.colors.headingTextColor,
                            textAlign: 'left',
                            alignSelf: 'flex-start',
                            padding: 5,
                            marginTop: 30
                        }}>{t(AUTH_KEYS.MPIN_LOGIN.DEAR_CUSTOMER)}</Text>

                    <Text
                        style={{
                            fontSize: fontSize.textNormal,
                            fontFamily: fontName.regular,
                            color: theme.colors.notice_color,
                            textAlign: 'left',

                        }}>{errorMessage}</Text>

                </View>
                <Text
                    style={{
                        fontSize: fontSize.textLarge,
                        fontFamily: fontName.bold,
                        color: theme.colors.buttonStrokeCenterColor,
                        textAlign: 'left',
                        alignSelf: 'flex-start',
                        padding: 5,
                        marginTop: 30,
                        position: 'absolute',
                        bottom: 180,
                        left: 30


                    }}>{t(AUTH_KEYS.MPIN_LOGIN. THANK_YOU_FOR_COOPRATION)}</Text>
                <View style={{
                    position: 'absolute', bottom: 120,
                    left: 5,
                    width: '100%'
                }}>
                    <MainButton title={t(AUTH_KEYS.MPIN_LOGIN.DONE)} onPress={onPress} />
                </View>


            </TouchableOpacity>
        </Overlay>
    )

}

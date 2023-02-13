import React, { useContext, useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
} from "react-native";
import { useTranslation } from 'react-i18next';
import { AUTH_KEYS } from "../../../assets/translations/constants";
import { Overlay } from 'react-native-elements';
import { fontName, fontSize, SIZES } from "../../../styles/global.config";
import { AppContext } from "../../../themes/AppContextProvider";
import PlainButton from "../button/PlainButton";
import { touchId, faceID } from "../../../assets/icons";
import TouchID from "react-native-touch-id";



export default function SelectMPINPopup({
    showMpinPopUp,
    onPressCancel,
    OnTouchIDPress,
    EnterPINPress,
}) {
    const { theme, changeTheme } = useContext(AppContext)
    const { t, i18n } = useTranslation();


    const [hasFaceId, setFaceId] = useState(false);

    useEffect(() => {
        TouchID.isSupported()
            .then(biometryType => {
                // Success code
                if (biometryType === 'FaceID') {
                    console.log('FaceID is supported.');
                    setFaceId(true)
                } else {
                    console.log('TouchID is supported.');
                    setFaceId(false)
                }
            })
            .catch(error => {
                // Failure code
                console.log(error);
            });
    }, [])


    return (
        <Overlay
            isVisible={showMpinPopUp}
            overlayStyle={{
                shadowColor: 'rgba(69,85,117,0.0)',
                backgroundColor: 'white',
                margin: 20,
                borderRadius: 5
            }}>
            <TouchableOpacity
                activeOpacity={1}
            >
                <View style={{
                    width: SIZES.width * 0.8,
                    padding: 10,
                    flexDirection: 'column',
                    backgroundColor: 'white'
                }}>
                    <Text
                        style={{
                            fontSize: fontSize.textNormal,
                            fontFamily: fontName.regular,
                            color: theme.colors.textColor,
                            textAlign: 'left',
                            marginBottom: 20,
                            marginTop: 20

                        }}>{"Please choose your option to login"}</Text>
                    <TouchableOpacity
                        onPress={OnTouchIDPress}
                    >
                        <Image
                            source={hasFaceId ? faceID : touchId}
                            resizeMode='contain'
                            style={{
                                width: 50, height: 50,
                                tintColor: hasFaceId ? theme.colors.buttonColor : null
                            }}
                        />
                        <Text
                            style={{
                                fontSize: fontSize.textNormal,
                                fontFamily: fontName.regular,
                                color: theme.colors.textColor,
                                textAlign: 'left',
                                marginBottom: 20,
                                marginTop: 10

                            }}>{hasFaceId ? "Face ID" : "Touch ID"}</Text>
                    </TouchableOpacity>


                </View>
                <View style={{
                    borderTopWidth: 0.5,
                    width: SIZES.width * 0.8,
                    borderTopColor: theme.colors.grey,
                    opacity: 0.2
                }} />
                <TouchableOpacity
                    onPress={EnterPINPress}
                >
                    <Text
                        style={{
                            fontSize: fontSize.textNormal,
                            fontFamily: fontName.medium,
                            color: theme.colors.buttonColor,
                            textAlign: 'left',
                            marginBottom: 10,
                            padding: 10,
                            marginTop: 10

                        }}>{"Enter mPIN"}</Text>
                </TouchableOpacity>
                <View style={{
                    borderTopWidth: 0.5,
                    width: SIZES.width * 0.8,
                    borderTopColor: theme.colors.grey,
                    opacity: 0.2
                }} />
                <View style={{ alignSelf: 'flex-end', marginRight: 20, padding: 15 }}>
                    <PlainButton title={"Cancel"} onPress={onPressCancel}
                        style={{ color: theme.colors.grey, fontFamily: fontName.medium, fontSize: 16 }} />
                </View>


            </TouchableOpacity>
        </Overlay>
    )

}

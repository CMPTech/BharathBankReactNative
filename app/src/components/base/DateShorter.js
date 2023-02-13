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
import { fontName, fontSize, pixelSizeHorizontal } from "../../../styles/global.config";
import { AppContext } from "../../../themes/AppContextProvider";
import MainButton from "../../components/button/MainButton";
export default function DateShortComponent({ showError, errorMessage, setErrorPopUp, onPressA, onPressD, order }) {

    const { theme, changeTheme } = useContext(AppContext)
    const { t, i18n } = useTranslation();
    return (
        <Overlay
            isVisible={showError}
            onBackdropPress={() => {
                setErrorPopUp({
                    show: false,
                    message: ''
                })
            }}
            overlayStyle={{
                shadowColor: 'rgba(69,85,117,0.0)',
                backgroundColor: '#ffffff',
                borderWidth: 0,
                width: '55%',
                height: '20%',
                marginLeft: 'auto',
                marginBottom: 'auto',
                marginRight: '15%',
                marginTop: '30%',
                justifyContent: 'center'
            }}>
            {/* <TouchableOpacity
                activeOpacity={1}
                // style={{ width: 300, height: 200 }}
                onPress={() => {
                    setErrorPopUp({
                        show: false,
                        message: ''
                    })
                }}> */}

            <View>
                <>
                    <MainButton
                        title={'Recent first  ↑'}
                        onPress={onPressA}
                        btnContainerStyle={{ width: '90%', height: '40%', borderRadius: 10 }}
                        titleStyle={{
                            padding: Platform.OS === 'android' ? pixelSizeHorizontal(15) : pixelSizeHorizontal(20),
                            color: theme.colors.buttonTextColor,
                            textAlign: 'center',
                            fontSize: fontSize.textNormal,
                            fontFamily: fontName.medium,
                            letterSpacing: 1,
                        }}
                        oColors={order === "A" ? ["#1A70FF", "#1A70FF", "#1A70FF"] : ["#D3D3D3", "#D3D3D3", "#D3D3D3"]}
                    />
                </>
                <>
                    <MainButton
                        title={'Old first  ↑'}
                        onPress={onPressD}
                        btnContainerStyle={{ width: '90%', height: '40%', borderRadius: 10 }}
                        titleStyle={{
                            padding: Platform.OS === 'android' ? pixelSizeHorizontal(15) : pixelSizeHorizontal(20),
                            color: theme.colors.buttonTextColor,
                            textAlign: 'center',
                            fontSize: fontSize.textNormal,
                            fontFamily: fontName.medium,
                            letterSpacing: 1,
                        }}
                        oColors={order === "D" ? ["#1A70FF", "#1A70FF", "#1A70FF"] : ["#D3D3D3", "#D3D3D3", "#D3D3D3"]}
                    />
                </>

            </View>


            {/* </TouchableOpacity> */}
        </Overlay>
    )

}

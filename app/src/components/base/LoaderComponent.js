import { t } from "i18next";
import React, { useEffect, useState, useContext } from "react";
import {
    View,
    Text,
    Dimensions,
    Image
} from "react-native";
import { AUTH_KEYS } from "../../../assets/translations/constants";
import { colors, fontSize, SIZES } from "../../../styles/global.config";
import { AppContext } from "../../../themes/AppContextProvider";
export default function LoaderComponent({}) {
    const { theme, changeTheme } = useContext(AppContext)

    return (
                <View style={{
                    height: SIZES.height,
                    position: "absolute",
                    left: 0,
                    right: 0,
                    //top: 0,
                    bottom: 0,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: 'rgba(52, 52, 52, 0.8)'
                }}>
                    {/* <UIActivityIndicator size={100} color={theme.colors.buttonColor} /> */}
                    <View style={{
                        width: '100%', padding: 30,
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: theme.colors.white
                    }}>
                        {/* <BarIndicator color={theme.colors.buttonStrokeStartColor} /> */}
                        <Image
                            style={{ alignSelf: 'center', width: 70, height: 70 }}
                            source={require('./../../../assets/images/loader_flip.gif')} />
                        <Text style={{ textAlign: 'center', padding: 10, color: theme.colors.grey, fontSize: fontSize.header3 }}>{t(AUTH_KEYS.MAIN_SCREEN.LOADING)}</Text>
                    </View>
                </View>
            )

}


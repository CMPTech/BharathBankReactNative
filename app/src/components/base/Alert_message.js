import React, { useEffect, useState, useContext } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity
} from "react-native";
import { colors, fontName, fontSize, SIZES } from "../../../styles/global.config";
import { AppContext } from "../../../themes/AppContextProvider";
export default function AlerComponent({
    onCancel,
    onSave,
    cancelButtonTitle,
    okButtonTitle,
    heading,
    message,
    outSideOnPress,
    transparent
}) {
    const [backgroundColor, setBackground] = useState(colors.textColorgrey)
    const { theme, changeTheme } = useContext(AppContext)
    return (
        <TouchableOpacity 
        onPress={outSideOnPress}
        style={{
            height: '100%',
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            alignItems: "center",
            justifyContent: "center",
        }}>
            <View style={{
                padding: 30,
                position: "absolute",
                left: 20,
                right: 20,
             elevation:5,
                backgroundColor: theme.colors.white
            }}>
                <Text style={{ color: theme.colors.grey, fontSize: fontSize.header3, fontFamily: fontName.medium, color: colors.textColorgrey }}>{heading}</Text>
                <Text style={{ color: theme.colors.grey, fontSize: fontSize.textNormal, fontFamily: fontName.regular, color: colors.textColorgrey ,marginTop:10}}>{message}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 20 }}>
                    <TouchableOpacity onPress={onCancel}>
                        <Text style={{ color: theme.colors.grey, fontSize: fontSize.header3, fontFamily: fontName.medium, color: colors.textColorgrey, marginRight: 30 }}>{cancelButtonTitle}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onSave}>
                        <Text style={{ color: theme.colors.grey, fontSize: fontSize.header3, fontFamily: fontName.medium, color: colors.buttonColor, }}>{okButtonTitle}</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </TouchableOpacity>
    )

}
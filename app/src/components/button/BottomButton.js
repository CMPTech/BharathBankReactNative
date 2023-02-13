import React, { useContext } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    TouchableOpacity
} from "react-native";
import { colors, fontName, fontSize, SIZES, FONTS } from "../../../styles/global.config";
import { AppContext } from "../../../themes/AppContextProvider";
export default function BottomButton({
    title,
    onPress,
    titleStyle,
    containerStyle,
    disabled = false

}) {

    const { theme, changeTheme } = useContext(AppContext)
    return (<TouchableOpacity
        style={{ position: 'absolute', bottom: 0, padding: 15, width: SIZES.width, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.buttonStrokeEndColor, ...containerStyle }}
        disabled={disabled}
        onPress={onPress}

    >
        <Text style={{ ...FONTS.h3, color: theme.colors.white, fontFamily: fontName.medium, ...titleStyle }}>{title}</Text>
    </TouchableOpacity>)
}
import React, { useContext } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    TouchableOpacity
} from "react-native";
import { colors, fontName, fontSize } from "../../../styles/global.config";
import { AppContext } from "../../../themes/AppContextProvider";
import StyleTextView from "../input/StyleTextView";

export default function PlainButton({
    title,
    onPress,
    type,
    direction,
    icon,
    titleStyle,
    containerStyle,
    oColors,
    bold,
    width,
    disabled,
    onPressIn,
    onPressOut,
    style
}) {
    const { theme, changeTheme } = useContext(AppContext)

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
        >
            {direction === 'left' && icon ? (
                <View style={rightIconStyle}>{icon}</View>
            ) : null}
            <StyleTextView style={[{
                color: theme.colors.buttonColor,
                textAlign: 'center',
                fontSize: fontSize.textNormal,
                fontFamily: fontName.regular,
            }, style]} value={title}></StyleTextView>
            {direction === 'right' && icon ? (
                <View style={leftIconStyle}>{icon}</View>
            ) : null}
        </TouchableOpacity>
    );
}


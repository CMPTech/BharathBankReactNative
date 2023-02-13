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

export default function SecondaryButton({
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
    textStyle
}) {
    const { theme, changeTheme } = useContext(AppContext)
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            style={{ marginTop: 10, borderRadius: 10, borderColor: theme.colors.secondaryButtonTextColor, borderWidth: 1 }}>
            {direction === 'left' && icon ? (
                <View style={rightIconStyle}>{icon}</View>
            ) : null}
            <StyleTextView style={[{
                padding: 10,
                color: theme.colors.secondaryButtonTextColor,
                textAlign: 'center',
                fontSize: fontSize.textNormal,
                fontFamily: fontName.medium
            },textStyle]} value={title}></StyleTextView>
            {direction === 'right' && icon ? (
                <View style={leftIconStyle}>{icon}</View>
            ) : null}
        </TouchableOpacity>
    );
}


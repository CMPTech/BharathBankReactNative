import React from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    TouchableOpacity
} from "react-native";
import { colors, fontName, fontSize } from "../../../styles/global.config";
import StyleTextView from "../input/StyleTextView";

export default function BackButton({
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
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            >
            {direction === 'left' && icon ? (
                <View style={rightIconStyle}>{icon}</View>
            ) : null}
            <StyleTextView style={[{
                color: colors.secondaryButtonTextColor,
                textAlign: 'center',
                fontSize: fontSize.textNormal,
                fontFamily: fontName.medium,
                marginTop:30
            },style]} value={title}></StyleTextView>
            {direction === 'right' && icon ? (
                <View style={leftIconStyle}>{icon}</View>
            ) : null}
        </TouchableOpacity>
    );
}


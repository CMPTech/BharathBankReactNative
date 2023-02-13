import React, { useContext } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    TouchableOpacity,
    Platform
} from "react-native";
import { colors, fontName, fontSize, pixelSizeHorizontal, pixelSizeVertical } from "../../../styles/global.config";
import { AppContext } from "../../../themes/AppContextProvider";
import StyleTextView from "../input/StyleTextView";
import LinearGradient from 'react-native-linear-gradient';

export default function MainButton({
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
    btnContainerStyle,
    noBorder
}) {

    const { theme, changeTheme } = useContext(AppContext)

    const disabledButtonColor = [theme.colors.disableButtonStrokeStartColor, theme.colors.disableButtonStrokeCenterColor, theme.colors.disableButtonStrokeEndColor]
    const activeButtonColor = [theme.colors.buttonStrokeStartColor, theme.colors.buttonStrokeCenterColor, theme.colors.buttonStrokeEndColor]
    return (
        <LinearGradient
            colors={oColors ? oColors : disabled ? disabledButtonColor : activeButtonColor}
            style={[{
                marginTop: pixelSizeVertical(10),
                borderRadius: noBorder ? 0 : 5,
                alignSelf: 'center',
                justifyContent: 'center',
                paddingLeft: 10,
                paddingRight: 10,
                //paddingTop: 3, paddingBottom: 3
            }, btnContainerStyle]}
            useAngle={true}
            angle={180}>
            <TouchableOpacity
                onPress={onPress}
                style={{ ...containerStyle }}
                disabled={disabled}
                activeOpacity={disabled ? 1 : 1}
            >
                {direction === 'left' && icon ? (
                    <View style={rightIconStyle}>{icon}</View>
                ) : null}
                <StyleTextView style={titleStyle || {
                    padding: Platform.OS === 'android' ? pixelSizeHorizontal(15) : pixelSizeHorizontal(20),
                    color: theme.colors.buttonTextColor,
                    textAlign: 'center',
                    fontSize: fontSize.header3,
                    fontFamily: fontName.medium,
                    letterSpacing: 1,
                }} value={title}></StyleTextView>
                {direction === 'right' && icon ? (
                    <View style={leftIconStyle}>{icon}</View>
                ) : null}
            </TouchableOpacity>
        </LinearGradient>
    );
}


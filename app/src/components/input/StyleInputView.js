import React, { useContext, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity
} from "react-native";
import StyleTextView from "./StyleTextView";
import Box from '../base/Box'
import InputView from "./InputView";
import { colors, fontName, fontSize } from "../../../styles/global.config";
import PlainButton from "../button/PlainButton";
import { AppContext } from "../../../themes/AppContextProvider";
import { MoreInfoIcon } from "../../../assets/svg";

export default function StyleInputView({
    text,
    placeholder,
    value,
    onChangeText,
    keyboardType,
    secureTextEntry,
    forgotText,
    onSubmitEditing,
    maxLength,
    onPress,
    required,
    touched,
    errors = "",
    setRef,
    editable,
    containerStyle,
    inputViewStyle,
    hintStyle,
    rightIcon,
    autoCapitalize,
    textInputConatinerStyle,
    leftIcon,
    rightIconOnPress,
    showRightIcon,
    placeholderColor,
    errorColor,
    onBlur,
    onBlurRequired,
    autoComplete,
    textContentType,
    multiline,
}) {

    const { theme, changeTheme } = useContext(AppContext)
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={{ marginTop: 20, ...containerStyle }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <StyleTextView
                    style={[{ color: isFocused ? theme.colors.buttonColor : theme.colors.grey,  }, hintStyle]}
                    value={text != null ? text : (value.length > 0 ? placeholder : "")} required={required} />
                <PlainButton title={forgotText} style={{ color: theme.colors.buttonColor }} onPress={onPress} />
            </View>
            <View style={{ justifyContent: 'center' }}>
                <InputView
                    placeholder={placeholder}
                    value={value}
                    placeholderColor={placeholderColor}
                    onChangeText={onChangeText}
                    keyboardType={keyboardType}
                    secureTextEntry={secureTextEntry}
                    onSubmitEditing={onSubmitEditing}
                    maxLength={maxLength}
                    touched={touched}
                    leftIcon={leftIcon}
                    autoCapitalize={autoCapitalize}
                    setRef={setRef}
                    textInputConatinerStyle={textInputConatinerStyle}
                    rightIcon={rightIcon}
                    editable={editable}
                    multiline={multiline}
                    textContentType={textContentType}
                    autoComplete={autoComplete}
                    onFocus={() => {
                        setIsFocused(true)
                    }}
                    onBlur={() => {
                        setIsFocused(false)
                        if(onBlurRequired)
                        {
                            onBlur()
                        }
                       
                    }}
                    inputViewStyle={inputViewStyle}
                />
                {showRightIcon &&
                    <TouchableOpacity
                        style={{ flex: 1, position: 'absolute', right: 0, bottom: 10, flexDirection: 'column' }}
                        onPress={rightIconOnPress} >
                        <MoreInfoIcon />
                    </TouchableOpacity>
                }
            </View>
            {errors && touched ? (
                <StyleTextView value={errors} style={{
                    color: errorColor ? errorColor : theme.colors.red,
                    fontSize: fontSize.textSmall,
                    marginTop: 5,
                    fontFamily: fontName.regular
                }} />
            ) : null
            }
        </View>
    );
}


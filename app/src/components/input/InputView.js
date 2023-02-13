import React, { useContext, useState } from "react";
import {
    View,
    Text,
    TextInput,
    Clipboard
} from "react-native";
import { colors, fontName, fontSize, SIZES } from "../../../styles/global.config";
import { AppContext } from "../../../themes/AppContextProvider";
import LinearGradient from 'react-native-linear-gradient';

export default function InputView({
    placeholder,
    value,
    onChangeText,
    keyboardType,
    secureTextEntry,
    onSubmitEditing,
    maxLength,
    touched,
    errors,
    setRef,
    editable,
    inputViewStyle,
    onFocus,
    rightIcon,
    autoCapitalize,
    textInputConatinerStyle,
    onBlur,
    leftIcon,
    placeholderColor,
    textContentType,
    autoComplete,
    multiline
}) {

    const { theme, changeTheme } = useContext(AppContext)

    const [isFocused, setIsFocused] = useState(false);

    return (
        // <LinearGradient
        //     colors={[theme.colors.buttonBgColor, theme.colors.buttonBgColor]}
        //     style={{ marginTop: 0, borderRadius: 10,alignSelf: 'stretch' }}
        //     useAngle={true}
        //     angle={179}>
        <View style={{
            pointerEvents: "none",
            flexDirection: 'row', width: SIZES.width * 0.85,
            borderBottomColor: isFocused ? placeholderColor ? placeholderColor : theme.colors.buttonColor : placeholderColor ? placeholderColor : theme.colors.grey,
            borderBottomWidth: isFocused ? 0.5 : 0.5,
            ...textInputConatinerStyle
        }}>
            {leftIcon}
            <TextInput
                style={[{
                    borderRadius: 0,
                    marginTop: 3,
                    marginLeft: 0,
                    fontFamily: fontName.semi_bold,
                    fontSize: fontSize.textLarge,
                    flex: 1,
                    // borderBottomWidth: 1,
                    // borderBottomColor: isFocused ? theme.colors.buttonColor : theme.colors.grey,
                    //borderColor: theme.colors.borderColor,
                    fontFamily: fontName.medium,
                    padding: 0,
                    // backgroundColor: theme.colors.buttonBgColor,
                    // color: theme.colors.black,
                    color: "#545555",
                }, inputViewStyle]}
                onBlur={() => {
                    setIsFocused(false)
                    onBlur()
                    // Clipboard.setString('')
                }
                }
                onFocus={() => {
                    setIsFocused(true)
                    onFocus()
                    // Clipboard.setString('')
                }}
                placeholderTextColor={placeholderColor ? placeholderColor : "grey"}
                contextMenuHidden={true}
                selectTextOnFocus={false}
                onFocused={isFocused}
                placeholder={placeholder}
                value={value}
                selectionColor={placeholderColor ? placeholderColor : "grey"}
                onChangeText={onChangeText}
                keyboardType={keyboardType || 'default'}
                secureTextEntry={secureTextEntry}
                onSubmitEditing={onSubmitEditing}
                returnKeyLabel='Done'
                returnKeyType='done'
                autoCapitalize={autoCapitalize}
                inputContainerStyle={{ borderBottomWidth: 0 }}
                maxLength={maxLength}
                autoCorrect={false}
                touched={touched}
                errors={errors}
                underlineColorAndroid="transparent"
                textContentType={textContentType}
                autoComplete={autoComplete}
                ref={ref => {
                    setRef && setRef(ref)
                }}
                editable={editable}
                // caretHidden={true} 
                multiline={multiline}
            />
            {rightIcon}
        </View>
        // </LinearGradient>
    );
}


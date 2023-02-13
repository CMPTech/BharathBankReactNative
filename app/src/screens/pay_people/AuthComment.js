import React, { useContext, useState, } from "react";
import { TouchableOpacity, View } from 'react-native';
import { Overlay } from 'react-native-elements';
import { AppContext } from "../../../themes/AppContextProvider";
import StyleTextView from '../../components/input/StyleTextView';
import StyleInputView from "../../components/input/StyleInputView";
import {getAlphabetsAndNumbersSpaceOnly } from '../../utils/amount-util'
import { fontName, fontSize, FONTS, SIZES, currencyValue, colors } from "../../../styles/global.config";
const AuthCommentComponent = ({ remarks, setRemarks,navigation, route, isVisible, setVisible, title,subtitle,label,cancelTitle,approveTitle,onApprove,onCancel,color,rejectComentError,maxLength }) => {
    const { theme, changeTheme } = useContext(AppContext);
    return (<Overlay
        isVisible={isVisible}
        onBackdropPress={() => setVisible(!isVisible)}
        overlayStyle={{
            color: theme.colors.white,
            width: SIZES.width * 0.90,
            height: 300,
            padding: 30,

        }}>
        <StyleTextView value={title}
            style={{
                fontSize: fontSize.textLarge,
                fontFamily: fontName.medium,
                color: theme.colors.headingTextColor,

            }} />
        <StyleTextView value={subtitle}
            style={{
                fontSize: 14,
                marginTop: 10,
                fontFamily: fontName.regular,
                color: theme.colors.headingTextColor,
            }} />
        <StyleInputView
            placeholder={label}
            value={remarks}
            touched={rejectComentError}
            errors={rejectComentError}
            maxLength={maxLength?maxLength:50}
            containerStyle={{ marginTop: 20, width: SIZES.width * 0.75 }}
            textInputConatinerStyle={{ width: SIZES.width * 0.75}}
            hintStyle={{ fontFamily: fontName.medium }}
            inputViewStyle={{ fontFamily: fontName.medium, fontSize: fontSize.header3 }}
            onChangeText={(text) => {
                setRemarks(getAlphabetsAndNumbersSpaceOnly (text))
            }}

        />
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 40 }}>
            <TouchableOpacity
             onPress={onCancel}
            >
                <StyleTextView value={cancelTitle}
                    style={{
                        fontSize: fontSize.textLarge,
                        fontFamily: fontName.medium,
                        color: theme.colors.headingTextColor,
                        marginRight: 30,

                    }} />
            </TouchableOpacity>

            <TouchableOpacity
            onPress={onApprove}
            >
                <StyleTextView value={approveTitle}
                    style={{
                        fontSize: fontSize.textLarge,
                        fontFamily: fontName.medium,
                        color:color?color: theme.colors.pinkColor,

                    }} />
            </TouchableOpacity>

        </View>
    </Overlay>)

}
export default AuthCommentComponent;
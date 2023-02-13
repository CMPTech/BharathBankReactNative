import React, { useContext, useState, } from "react";
import { TouchableOpacity, View } from 'react-native';
import { Overlay } from 'react-native-elements';
import { AppContext } from "../../../themes/AppContextProvider";
import StyleTextView from '../../components/input/StyleTextView';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import { fontName, fontSize, FONTS, SIZES, } from "../../../styles/global.config";
const DebitCardActivationComponent = ({ navigation, route, isVisible, setVisible, title, subtitle, label, cancelTitle, approveTitle, onApprove, onCancel, debitCardPin, setDebitCardPIN }) => {
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
                marginRight:25,
                fontFamily: fontName.regular,
                color: theme.colors.headingTextColor,
            }} />
        <View style={{
            marginTop: '10%',
            alignItems: 'center',
            alignContent: 'center',
        }}>

            <SmoothPinCodeInput

                password mask="﹡"
                cellSize={50}
                codeLength={4}
                cellStyle={{
                    borderWidth: 2,
                    borderRadius: 10,
                    borderColor: theme.colors.otpBackground,
                    // marginTop: 20,
                    backgroundColor: theme.colors.otpBackground,
                }}
                cellStyleFocused={{
                    borderColor: theme.colors.buttonColor,
                }}
                textStyle={{
                    fontSize: fontSize.textNormal,
                    color: theme.colors.headingTextColor,
                    fontFamily: fontName.semi_bold,
                }}
                textStyleFocused={{
                    color: theme.colors.headingTextColor
                }}
                value={debitCardPin}
                onTextChange={otpValue => {
                    console.log(otpValue)
                    setDebitCardPIN(otpValue)
                }
                }
            />
        </View>
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
                        color: theme.colors.buttonColor,

                    }} />
            </TouchableOpacity>

        </View>
    </Overlay>)

}
export default DebitCardActivationComponent;
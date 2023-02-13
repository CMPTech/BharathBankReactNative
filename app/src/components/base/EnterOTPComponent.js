import React, { useContext, useEffect, useState } from "react";
import {
    View,
    Text,
    Keyboard
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Logo } from "../../../assets/svg";
import { colors, fontSize } from "../../../styles/global.config";
import { AppContext } from "../../../themes/AppContextProvider";
import StyleTextView from "../input/StyleTextView";
import HeaderTitleText from "./HeaderTitleText";
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import Environment from "../../environment";
import MainButton from "../button/MainButton";
import BackButton from "../button/BackButton";
import Box from "./Box";

export default function EnterOTPComponent({ navigation, title, style, otp, apiCall, onChangeText }) {

    const { theme, changeTheme } = useContext(AppContext)
    const [disableButton, setDisableButton] = useState(true);

    return (
        <View style={{ flex: 1 ,marginTop:10}}>
            <HeaderTitleText title={"Enter OTP"} />
            <Box>
                <StyleTextView value={"An OTP has been sent to your\nregistered mobile number or email address"} style={{ color: theme.colors.secondaryButtonTextColor }} />
                <View style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignItems: 'center',
                    marginTop: 10
                }}>
                    <SmoothPinCodeInput
                        password mask="﹡"
                        cellSize={50}
                        codeLength={Environment.OTP_LENGTH}
                        value={otp}
                        onTextChange={otpValue => {
                            onChangeText(otpValue)
                            if (otpValue.length === Environment.OTP_LENGTH) {
                                setDisableButton(false)
                                Keyboard.dismiss()
                            } else {
                                setDisableButton(true)
                            }
                        }
                        }
                        cellStyle={{
                            borderWidth: 2,
                            borderRadius: 10,
                            borderColor: theme.colors.borderColor,
                        }}
                        cellStyleFocused={{
                            borderColor: theme.colors.textColor,
                        }}
                        textStyle={{
                            fontSize: fontSize.textNormal,
                            color: theme.colors.textColor
                        }}
                        textStyleFocused={{
                            color: theme.colors.textColor
                        }}
                    />

                    <View style={{ width: '100%' }}>

                        <MainButton title={"Submit"} disabled={disableButton} onPress={apiCall} />
                    </View>
                    <StyleTextView value={"Resend OTP in 00:20 seconds"} style={{ marginTop: 20, color: theme.colors.secondaryButtonTextColor }} />

                    <StyleTextView value={"Don't received the code? "} style={{ marginTop: 20, color: theme.colors.secondaryButtonTextColor }} subText={"Try Again"} subTextStyle={{ margin: 20, color: theme.colors.buttonColor }}/>

                    <BackButton title={"Go Back"} onPress={() => navigation.goBack()} />
                </View>
            </Box>
        </View>
    );
}


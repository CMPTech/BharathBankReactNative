import React, { useContext } from "react";
import {
    View,
    Text
} from "react-native";
import { colors, fontName, fontSize } from "../../../styles/global.config";
import { AppContext } from "../../../themes/AppContextProvider";


export default function StyleTextView({ value, style, required, subText, subTextStyle, numberOfLines }) {

    const { theme, changeTheme } = useContext(AppContext)

    return (
        <Text
            numberOfLines={numberOfLines}
            style={[{
                color: theme.colors.textColor,
                fontSize: fontSize.textNormal,
                fontFamily: fontName.regular
            }, style]}>
            {value}
            {subText &&
                <Text style={[{
                    fontSize: fontSize.textNormal,
                    fontFamily: fontName.regular
                }, subTextStyle]}>
                    {subText}
                </Text>
            }
            {required &&
                <Text style={[{
                    color: colors.red,
                    fontSize: fontSize.textNormal,
                    fontFamily: fontName.regular
                }, style]}>
                    {" *"}
                </Text>
            }
        </Text>
    );
}


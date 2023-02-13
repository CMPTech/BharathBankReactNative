import React, { useContext, useEffect } from "react";
import {
    View,
    Text
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Logo } from "../../../assets/svg";
import { colors, fontName, fontSize } from "../../../styles/global.config";
import { AppContext } from "../../../themes/AppContextProvider";

export default function TitleText({ title,style }) {

    const { theme, changeTheme } = useContext(AppContext)

    return (
        <View>
            <Text style={[{
                color: theme.colors.grey,
                fontSize: fontSize.header1,
                fontFamily: fontName.bold,
                //letterSpacing: 1,
            },style]}>{title}</Text>
        </View>
    );
}


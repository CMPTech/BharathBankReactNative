import React, { useContext, useEffect } from "react";
import {
    View,
    Text
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Logo } from "../../../assets/svg";
import { colors, fontName } from "../../../styles/global.config";
import { AppContext } from "../../../themes/AppContextProvider";

export default function HeaderTitleText({ title ,style}) {

    const { theme, changeTheme } = useContext(AppContext)

    return (
        <View style={[{
            flexDirection: 'row',
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 10
        },style]}>
            <Text style={{
                color: theme.colors.headingTextColor,
                fontSize: 24,
                fontFamily: fontName.semi_bold,
            }}>{title}</Text>
        </View>
    );
}


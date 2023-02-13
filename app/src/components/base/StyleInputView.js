import React, { useContext, useEffect } from "react";
import {
    View,
    Text
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BodyDesignIcon } from "../../../assets/svg";
import { colors } from "../../../styles/global.config";
import { AppContext } from "../../../themes/AppContextProvider";
import AuthHeader from "./AuthHeader";
import HeaderTitleText from "./HeaderTitleText";

export default function StyleInputView({ children }) {
    const { theme, changeTheme } = useContext(AppContext)
    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.colors.mainBackground
            }}>
            <AuthHeader />
           
            <View style={{ position: 'absolute', bottom: '10%' }}>
                <BodyDesignIcon />
            </View>
            {children}

        </SafeAreaView>
    );
}


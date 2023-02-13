import React, { useContext, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackIcon, Logo } from "../../../assets/svg";
import { colors, fontName, FONTS, fontSize } from "../../../styles/global.config";
import { AppContext } from "../../../themes/AppContextProvider";
import LinearGradient from 'react-native-linear-gradient';

export default function AuthHeader({ children, title, navigation }) {

    const { theme, changeTheme } = useContext(AppContext)

    return (
        
        <LinearGradient
            useAngle={true}
            angle={135}
            style={{ paddingTop: 10, paddingBottom: 10 }}
            angleCenter={{ x: 0.5, y: 0.5 }}
            colors={["#4370e7", "#4370e7", "#4370e7", "#4ad4e8"]}>

            <View style={{
                flexDirection: 'row', textAlign: 'center',
                alignContent: 'center',
                alignItems: 'center',
            }}>
                <TouchableOpacity
                    onPress={() => { navigation.goBack() }}>
                    <BackIcon />
                </TouchableOpacity>
                <Text style={
                   FONTS.headerText
                }>{title}</Text>
            </View>
        </LinearGradient>

    );


}


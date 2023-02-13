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

export default function AuthNoGradientHeader({ children, title, navigation }) {

    const { theme, changeTheme } = useContext(AppContext)

    return (

        <View style={{
            flexDirection: 'row', textAlign: 'center',
            alignContent: 'center',
            alignItems: 'center',
            paddingTop: 10, paddingBottom: 10
        }}>
            {/* <View style={{
                    position: 'absolute',
                    left: 0,
                    alignContent: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    zIndex: 1
                }}> */}
            <TouchableOpacity
                onPress={() => { navigation.goBack() }}>
                <BackIcon />
            </TouchableOpacity>
            {/* </View> */}


            <Text style={FONTS.headerText}>{title}</Text>
        </View>

    );


}


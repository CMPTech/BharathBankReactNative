import React, { useCallback, useContext, useEffect, useState } from "react";
import {
    TouchableOpacity,
    View,
    ScrollView,
} from "react-native";
import { Overlay } from 'react-native-elements'
import { AppContext } from "../../../themes/AppContextProvider";
import PlainButton from "../button/PlainButton";
import { BCBTheme, TechurateTheme } from '../../../themes/Themes'
import { GalleryIcon } from "../../../assets/svg";

export default function ChangeThemeComponent({ }) {

    const { theme, changeTheme } = useContext(AppContext)
    const [isVisible, setIsVisible] = useState(false)

    const [themeName, setThemeName] = useState('Change to dark theme')

    const toggleVisible = useCallback(() => {
        //setIsVisible(!isVisible)

        if (themeName === 'Change to dark theme') {
            changeTheme(BCBTheme)
            setThemeName("Change to light theme")
        } else {
            changeTheme(TechurateTheme)
            setThemeName("Change to dark theme")
        }

    }, [isVisible, themeName])
    return (
        <View style={{ flex: 1, width: 'auto' }}>
            <TouchableOpacity
                style={{ margin: 10 }}
                onPress={() => toggleVisible()}>
                <PlainButton title={themeName} style={{ padding: 10, color: theme.dark ? theme.colors.white : theme.colors.black }} onPress={() => { toggleVisible() }} />
            </TouchableOpacity>


            <Overlay
                isVisible={isVisible}
                onBackdropPress={() => setIsVisible(false)}
                height='auto'>
                <View style={{ minWidth: '80%' }}>
                    <PlainButton title={"Dark Theme "} style={{ padding: 10, color: theme.colors.colorPrimary }} onPress={() => { changeTheme(BCBTheme) }} />
                    <PlainButton title={"Light Theme "} style={{ padding: 10, color: theme.colors.colorPrimary }} onPress={() => { changeTheme(TechurateTheme) }} />
                </View>
            </Overlay>
        </View>
    );
}


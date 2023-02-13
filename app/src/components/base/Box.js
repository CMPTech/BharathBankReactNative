import React, { useEffect } from "react";
import {
    Platform,
    View,
} from "react-native";

export default function Box({ children, height, bgColor,boxStyle }) {
    return (
        <View
            style={[{
                height: height || '100%',
                backgroundColor: bgColor ? bgColor : 'transparent',
                padding: Platform.OS === 'android' ? 10 : 10
            },boxStyle]}>
            {children}
        </View>
    );
}


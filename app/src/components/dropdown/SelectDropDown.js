import React, { useContext, useState } from "react";
import {
    View,
    Text, StyleSheet
} from "react-native";
import { AppContext } from "../../../themes/AppContextProvider";
import { Dropdown } from 'react-native-element-dropdown';
import StyleTextView from "../input/StyleTextView";
import { fontName, fontSize } from "../../../styles/global.config";
import LinearGradient from 'react-native-linear-gradient';

export default function SelectDropDownView({
    text,
    placeholder,
    data,
    onChangeText,
    onSubmitEditing,
    
    errors,
    setRef,
    selectedText
}) {
    const renderItem = (item) => {
        return (
            <View style={{
                padding: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'transparent'
            }}>
                <Text>{item.label}</Text>
            </View>
        );
    };

    return (
        <View style={{ marginTop: 10, marginHorizontal: 20 }}>
            <Text>{text}</Text>
            <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={data}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={placeholder}
                value={selectedText}
                onChange={(item) => {
                    onChangeText(item)
                }}
                renderItem={renderItem}
                setRef={setRef}
                onSubmitEditing={onSubmitEditing}
            />
            {errors &&
                <StyleTextView value={errors} style={{
                    color: theme.colors.red,
                    fontSize: 12,
                    fontFamily: fontName.regular
                }} />
            }

        </View>
    );
}
const styles = StyleSheet.create({
    dropdown: {

        borderBottomWidth: 0.2,
        borderBottomColor: '#c9c9c9'
    },
    icon: {
        marginRight: 5,
    },
    placeholderStyle: {
        fontSize: 16,

    },
    selectedTextStyle: {
        fontSize: 16,
        fontFamily: fontName.medium
    },
    iconStyle: {
        width: 20,
        height: 20,
        color:'#2942d9'
    },

});

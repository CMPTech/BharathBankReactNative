import React, { useEffect, useState, useContext } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Platform
} from "react-native";
import { colors, fontName, fontSize, SIZES } from "../../../styles/global.config";
import { AppContext } from "../../../themes/AppContextProvider";
import { getAlphabetsAndNumbersSpaceOnly } from "../../utils/amount-util";
export default function EditRemarksComponent({
    onCancel,
    onSave,
    value,
    setRemarksValue
}) {
    const [backgroundColor, setBackground] = useState(colors.textColorgrey)
    const { theme, changeTheme } = useContext(AppContext)
    return (
        <View style={{
            height: '100%',
            position: "absolute",
            left: 0,
            right: 0,
            //top: 0,
            bottom: 0,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: 'rgba(52, 52, 52, 0.8)'
        }}>
            <View style={{
                padding: 30,
                position: "absolute",
                left: 20,
                right: 20,
                // bottom: SIZES.height / 2,
                backgroundColor: theme.colors.white
            }}>
                <Text style={{ color: theme.colors.grey, fontSize: fontSize.header3, fontFamily: fontName.medium, color: colors.textColorgrey }}>Edit</Text>
                <Text style={{ color: theme.colors.grey, fontSize: fontSize.textNormal, fontFamily: fontName.medium, color: colors.buttonColor,marginTop:10 }}>{value.length > 0 ?'Add remarks':''}</Text>
                <TextInput
                    style={{ borderBottomColor: backgroundColor, borderBottomWidth: 0.5, paddingBottom: Platform.OS==='ios'?0: 10, fontFamily: fontName.medium, color: colors.textColorgrey, fontSize: fontSize.textNormal }}
                    placeholder='Add remarks'
                    value={value}
                    maxLength={50}
                    placeholderTextColor={theme.colors.grey}
                    onChangeText={(text) => {
                        setRemarksValue(getAlphabetsAndNumbersSpaceOnly(text))
                        if (text.length > 0) {
                            setBackground(colors.buttonColor)
                        }
                        else {
                            setBackground(colors.textColorgrey)
                        }

                    }}

                />
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 20 }}>
                    <TouchableOpacity onPress={onCancel}>
                        <Text style={{ color: theme.colors.grey, fontSize: fontSize.header3, fontFamily: fontName.medium, color: colors.textColorgrey, marginRight: 30 }}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onSave}>
                        <Text style={{ color: theme.colors.grey, fontSize: fontSize.header3, fontFamily: fontName.medium, color: colors.buttonColor, }}>Save</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </View>
    )

}
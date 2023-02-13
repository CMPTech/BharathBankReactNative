import { t } from "i18next";
import React, { useEffect, useState, useContext } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity
} from "react-native";
import { AUTH_KEYS } from "../../../assets/translations/constants";
import { useTranslation } from 'react-i18next';
import { colors, fontName, fontSize, SIZES } from "../../../styles/global.config";
import { AppContext } from "../../../themes/AppContextProvider";
import { getAlphabetsAndNumbersSpaceOnly ,getFirstSpaceNotAllowAlphabetsAndNumbersSpaceOnly} from "../../utils/amount-util";
import StyleTextView from "../input/StyleTextView";

export default function EditShortComponent({
    onCancel,
    onSave,
    accountShortName,
    setAccounShortName,
    errors = '',
    touched
}) {
    const [backgroundColor, setBackground] = useState(colors.textColorgrey)
    const { t, i18n } = useTranslation()
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
                <Text style={{ color: theme.colors.grey, fontSize: fontSize.header3, fontFamily: fontName.medium, color: colors.textColorgrey }}>{t(AUTH_KEYS.MAIN_SCREEN.EDIT)}</Text>
                <Text style={{ color: theme.colors.grey, fontSize: fontSize.textNormal, fontFamily: fontName.medium, color: colors.buttonColor, marginTop: 10 }}>{accountShortName.length > 0 ? t(AUTH_KEYS.MAIN_SCREEN.NICK_NAME) : ''}</Text>
                <TextInput
                    style={{ borderBottomColor: backgroundColor, borderBottomWidth: 1, paddingBottom: 10, fontFamily: fontName.medium, color: colors.textColorgrey, fontSize: fontSize.textNormal, }}
                    placeholder={t(AUTH_KEYS.MAIN_SCREEN.ENTER_NICK_NAME)}
                    value={accountShortName}
                    maxLength={50}
                    placeholderTextColor={theme.colors.grey}
                    onChangeText={(text) => {
                        setAccounShortName(getAlphabetsAndNumbersSpaceOnly(text[0]===" "?"":text))
                        if (text.length > 0) {
                            setBackground(colors.buttonColor)
                        }
                        else {
                            setBackground(colors.textColorgrey)
                        }

                    }}

                />
                {errors && touched ? (
                    <StyleTextView value={errors} style={{ color: theme.colors.grey, fontSize: fontSize.body5, fontFamily: fontName.regular, color: 'red', marginRight: 30 }} />
                ) : null
                }
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 20 }}>
                    <TouchableOpacity onPress={onCancel}>
                        <Text style={{ color: theme.colors.grey, fontSize: fontSize.header3, fontFamily: fontName.medium, color: colors.textColorgrey, marginRight: 30 }}>{t(AUTH_KEYS.LOCATE_US.CANCEL)}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onSave}>
                        <Text style={{ color: theme.colors.grey, fontSize: fontSize.header3, fontFamily: fontName.medium, color: colors.buttonColor, }}>{t(AUTH_KEYS.PAY_PEOPLE.SAVE)}</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </View>
    )

}
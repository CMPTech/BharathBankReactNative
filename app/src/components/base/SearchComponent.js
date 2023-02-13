import React, { useState } from 'react';
import {
    View,
    Image,
    TouchableOpacity, TextInput
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { AUTH_KEYS } from '../../../assets/translations/constants';
import {
    closeIcon,
} from '../../../assets/icons';
import { SearchIcon } from '../../../assets/svg';
import { colors, fontSize, SIZES, fontName } from "../../../styles/global.config";
const SearchComponent = ({ onChangeText, containerStyle, value = '', onClear, inputStyle, rightIconStyle, color }) => {
    const { t, i18n } = useTranslation();
    return (<View style={{ flexDirection: 'row', marginHorizontal: 10, width: SIZES.width * 0.9, alignItems: 'center', borderBottomWidth: 0.2, marginBottom: 10, borderBottomColor: color ? color : colors.grey, ...containerStyle, }}>
        <View>
            <SearchIcon color={color} />
        </View>
        <TextInput
            style={{ height: 40, color: color ? color : colors.textColorgrey,width: SIZES.width * 0.9, fontFamily: fontName.medium,marginLeft:10, ...inputStyle }}
            onChangeText={onChangeText}
            value={value}
            maxLength={30}
            placeholderTextColor={color ? color : colors.textColorgrey}
            placeholder= {t(AUTH_KEYS.PAY_PEOPLE.PAYEE_PEOPLE_SEARCH)}

        />
        {value.length > 0 &&
            <TouchableOpacity
                onPress={onClear}
            >
                <Image
                    style={{ width: 15, height: 15, tintColor: color ? color : colors.textColorgrey, marginRight: 20, ...rightIconStyle }}
                    source={closeIcon}
                />
            </TouchableOpacity>

        }

    </View>)
}
export default SearchComponent
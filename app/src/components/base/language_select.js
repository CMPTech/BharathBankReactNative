import React, { useState, useCallback } from 'react'
import { View, UIManager, LayoutAnimation, TouchableOpacity } from 'react-native'
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import { languageSelector } from '../../store/selectors';
import { SET_APP_LANGUAGE } from '../../store/constants';
import { DownArrowIcon } from '../../../assets/svg';
import { AUTH_KEYS } from '../../../assets/translations/constants'
import { fontName, fontSize } from "../../../styles/global.config";
import TitleText from "../../components/base/TitleText";
export default LanguageSelectComponent = ({ containerStyle }) => {
    const { t, i18n } = useTranslation();
    const language = useSelector(languageSelector);
    const [en, setEn] = useState(false)
    const dispatch = useDispatch();

    const setLanguage = useCallback(
        lang => {
            dispatch({ type: SET_APP_LANGUAGE, payload: lang })
                i18n.changeLanguage(lang);
        },
        [language]
    )
    return (<TouchableOpacity
        style={{ ...containerStyle, flexDirection: 'row',alignItems:'center',
        alignSelf:'flex-end'
     }}
        onPress={() => {
            setEn(!en)
            if (en) {
                setLanguage('en');
            }
            else {
                setLanguage('hi');
            }

        }}>
        <TitleText title={t(AUTH_KEYS.WEL_COME.LANGUAGE_LABEL)}
            style={{
                fontSize: fontSize.textNormal,
                fontFamily: fontName.regular,
            }} />
        <DownArrowIcon />
    </TouchableOpacity>)
}
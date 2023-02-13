import React, { useContext, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity
} from "react-native";
import { AppContext } from "../../../themes/AppContextProvider";
import { Dropdown } from 'react-native-element-dropdown';
import StyleTextView from "../input/StyleTextView";
import DropDownArrowIcon from "../../../assets/svg/drop-down-arrow.icon";
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { current } from "immer";
import { CalendarIcon } from "../../../assets/svg";
import LinearGradient from 'react-native-linear-gradient';
import { fontName } from "../../../styles/global.config";

export default function StyleDataPickerView({
    text,
    placeholder,
    data,
    value,
    onChangeText,
    minDate,
    maxDate,
    onDayPress,
    monthFormat,
    onMonthChange,
    current,
    required,
    touched,
    errors,
    setRef,
    setValue,
}) {

    const [showCalendar, setShowCalendar] = useState(false);

    const { theme, changeTheme } = useContext(AppContext)

    // LocaleConfig.locales['fr'] = {
    //     monthNames: [
    //       'Janvier',
    //       'Février',
    //       'Mars',
    //       'Avril',
    //       'Mai',
    //       'Juin',
    //       'Juillet',
    //       'Août',
    //       'Septembre',
    //       'Octobre',
    //       'Novembre',
    //       'Décembre'
    //     ],
    //     monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
    //     dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    //     dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
    //     today: "Aujourd'hui"
    //   };
    //   LocaleConfig.defaultLocale = 'fr';

    return (

        <View style={{ marginTop: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <StyleTextView value={text} required={required} />
            </View>
            <LinearGradient
                colors={[theme.colors.buttonStrokeStartColor, theme.colors.buttonStrokeEndColor]}
                style={{ marginTop: 5, borderRadius: 10 }}
                useAngle={true}
                angle={179}>
                <View
                    style={{
                        borderWidth: theme.paddings.boderWidth,
                        borderRadius: 10,
                        // marginBottom: 10,
                        borderColor: theme.colors.borderColor,
                        fontSize: 15,
                        fontFamily: fontName.regular,
                        padding: 6,
                        marginTop: 3,
                        marginLeft: 3,
                        backgroundColor: theme.colors.white,
                        color: theme.colors.textColor,
                        //color: theme.colors.textColor,
                        flexDirection: 'row',
                        flex: 1,
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                    <StyleTextView value={value} style={{
                        fontSize: 15,
                        padding: 6,
                        fontFamily: fontName.regular
                    }} />
                    <TouchableOpacity onPress={() => {
                        setShowCalendar(!showCalendar)
                    }
                    }>
                        <CalendarIcon />
                    </TouchableOpacity>

                </View>
            </LinearGradient>
            {showCalendar &&
                <Calendar
                    minDate={minDate}
                    maxDate={maxDate}
                    onDayPress={(text) => {
                        onDayPress(text)
                        setShowCalendar(!showCalendar)
                    }
                    }
                    current={current}
                    onMonthChange={onMonthChange}
                    theme={{
                        selectedDayTextColor: theme.colors.red,
                        calendarBackground: theme.colors.mainBackground1,
                        todayTextColor: theme.colors.red,
                        dayTextColor: theme.colors.buttonColor,
                        textDisabledColor: theme.colors.textColor,
                        monthTextColor: theme.colors.buttonColor,
                    }}
                    style={{
                        backgroundColor: theme.colors.mainBackground1,
                    }}
                    hideExtraDays={true}
                    showCalendar={showCalendar}
                />}
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

